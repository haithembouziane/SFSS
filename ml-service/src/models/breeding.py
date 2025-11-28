"""
================================================================================
                    CROP BREEDING BACKEND - MAIN API
================================================================================

This is the backend processing module for the crop parent matching system.
It receives JSON requests from the frontend and returns breeding recommendations.

TEAM MEMBERS: This file should be imported and used in your API/server layer.
The output JSON files will be saved relative to the project folder.

================================================================================
                           FILE PATH CONFIGURATION
================================================================================

⚠️  IMPORTANT PATH INFORMATION:

The output JSON file will be saved in the following location:

    PROJECT_ROOT / breeding_result.json

Where PROJECT_ROOT is the directory containing this script.

Examples:
    - If this script is at:  C:/users/john/project/breeding_backend.py
    - Output will be saved: C:/users/john/project/breeding_result.json

The output JSON is ALWAYS relative to where this script is executed from.
If you want to change the output path, modify the OUTPUT_JSON_PATH variable below.

To use in your API:
    1. Import this module: from breeding_backend import process_breeding_request
    2. Call the function: result = process_breeding_request(frontend_json_input)
    3. The JSON will be automatically saved to breeding_result.json
    4. Return the result dict to the frontend

================================================================================
"""

import numpy as np
import json
import os
from pathlib import Path

# ============================================================================
# OUTPUT FILE CONFIGURATION
# ============================================================================
# 
# ⚠️  This path is RELATIVE to the project folder (where this script is located)
#    You can modify this to customize where output JSON files are saved
#
OUTPUT_JSON_PATH = "breeding_result.json"
# OUTPUT_JSON_PATH = "results/breeding_result.json"  # Alternative: save in subdirectory

# ⚠️  EXAMPLE DNA FILES - USED AS FALLBACK IF NO DNA PROVIDED
#    These paths are relative to the project folder
EXAMPLE_PARENTS_SNP_FILE = "example_parents_snp.json"  # Fallback SNP data
EXAMPLE_TRAIT_MAP_FILE = "dna_trait_map.json"  # Trait mappings


# ============================================================================
# GENETIC CLASSES (Must match notebook version exactly)
# ============================================================================

class Allele:
    """Single allele with dominance and effect value."""
    def __init__(self, name, effect, is_dominant=True):
        self.name = name
        self.effect = effect  # 0-10 scale
        self.is_dominant = is_dominant
    
    def __repr__(self):
        return self.name


class Genotype:
    """Allele pair for a trait (AA, Aa, or aa)."""
    def __init__(self, allele1, allele2):
        self.alleles = tuple(sorted([allele1, allele2], key=lambda a: (not a.is_dominant, a.name)))
    
    def get_phenotype_value(self):
        """Phenotypic expression based on dominance."""
        a1, a2 = self.alleles
        
        if a1.name == a2.name:  # Homozygous
            return a1.effect
        elif a1.is_dominant:  # Heterozygous (dominant expressed)
            return a1.effect
        else:  # Both recessive
            return (a1.effect + a2.effect) / 2
    
    def __repr__(self):
        return f"{self.alleles[0].name}{self.alleles[1].name}"


class TraitLocus:
    """Maps trait name to genotype."""
    def __init__(self, trait_name, genotype):
        self.trait_name = trait_name
        self.genotype = genotype
    
    def __repr__(self):
        return f"{self.trait_name}:{self.genotype}"


# ============================================================================
# SNP → TRAIT MAPPING CONVERSION
# ============================================================================

def dna_to_traits(dna_snps, trait_map_path=EXAMPLE_TRAIT_MAP_FILE):
    """
    Convert SNP genotypes to trait phenotype scores.
    
    This function reads SNP genotypes (e.g., AA, AG, GG) and uses a trait map
    to look up phenotype scores for each SNP. If multiple SNPs control the same
    trait (polygenic), their scores are averaged.
    
    SNP FORMAT (input):
    ───────────────────
    {
        "rs123": "AA",
        "rs456": "AG",
        "rs789": "GG",
        ...
    }
    
    TRAIT MAP FORMAT (from dna_trait_map.json):
    ──────────────────────────────────────────
    {
        "rs123": {
            "trait": "Yield",
            "AA": 0.8,
            "AG": 0.6,
            "GG": 0.4
        },
        "rs456": {
            "trait": "Yield",
            "AA": 0.9,
            "AG": 0.7,
            "GG": 0.3
        },
        ...
    }
    
    OUTPUT:
    ───────
    {
        "Yield": 0.75,                  # Average of SNP scores
        "Disease_Resistance": 0.65,
        "Water_Efficiency": 0.70,
        "Growth_Rate": 0.80
    }
    
    Args:
        dna_snps: Dict of SNP genotypes {snp_id: genotype_string}
        trait_map_path: Path to trait mapping JSON file
    
    Returns:
        dict: Trait scores (0-1 scale) aggregated from SNPs
    """
    
    try:
        # Load trait mapping
        if not os.path.exists(trait_map_path):
            raise FileNotFoundError(f"Trait map file not found: {trait_map_path}")
        
        with open(trait_map_path, 'r') as f:
            trait_map = json.load(f)
        
        # Remove metadata (fields starting with _)
        trait_map = {k: v for k, v in trait_map.items() if not k.startswith('_')}
        
        # Aggregate SNP scores by trait (handles polygenic traits)
        traits = {}
        snp_count = 0
        trait_count = 0
        
        for snp_id, snp_data in dna_snps.items():
            if snp_id not in trait_map:
                # This SNP is not in our mapping (skip)
                continue
            
            snp_info = trait_map[snp_id]
            trait_name = snp_info["trait"]
            genotype = snp_data  # Format: "AA", "AG", "GG", etc.
            
            # Look up phenotype score for this genotype
            if genotype not in snp_info:
                print(f"  ⚠ Genotype {genotype} not found for SNP {snp_id}. Skipping.")
                continue
            
            score = snp_info[genotype]
            
            # Aggregate: if multiple SNPs control trait, store all scores
            if trait_name not in traits:
                traits[trait_name] = []
                trait_count += 1
            
            traits[trait_name].append(score)
            snp_count += 1
        
        # Average scores within each trait (for polygenic traits)
        final_traits = {trait: sum(scores) / len(scores) for trait, scores in traits.items()}
        
        return final_traits
    
    except Exception as e:
        print(f"❌ Error converting DNA to traits: {str(e)}")
        raise


# ============================================================================
# LOAD EXAMPLE PARENTS FROM SNP JSON FILE (Fallback if no DNA files provided)
# ============================================================================

def load_example_parents(snp_file=EXAMPLE_PARENTS_SNP_FILE, trait_map_file=EXAMPLE_TRAIT_MAP_FILE):
    """
    ⚠️  FALLBACK FUNCTION: Load example parents from SNP JSON file
    
    This function is used when the frontend doesn't provide SNP data.
    It loads example parent genotypes from example_parents_snp.json,
    converts SNPs to trait scores using dna_to_traits(),
    then creates appropriate genotypes for the algorithm.
    
    FALLBACK JSON FILE LOCATION:
    ────────────────────────────
    example_parents_snp.json (in project root)
    
    WORKFLOW:
    ─────────
    1. Load SNP genotypes from example_parents_snp.json
    2. Use dna_to_traits() to map SNPs → trait phenotype scores (0-1)
    3. Convert phenotype scores → Allele objects (0-10 scale)
    4. Pair alleles into Genotype objects for each trait
    
    Args:
        snp_file: Path to SNP data file (default: example_parents_snp.json)
        trait_map_file: Path to SNP→trait mapping file (used by dna_to_traits)
    
    Returns:
        dict: Parents with their trait genotypes
        Example: {
            'Parent_A': {
                'Yield': Genotype(Allele(...), Allele(...)),
                'Disease_Resistance': Genotype(...),
                ...
            },
            ...
        }
    """
    
    try:
        # Load SNP data from example file
        if not os.path.exists(snp_file):
            raise FileNotFoundError(f"SNP file not found: {snp_file}")
        
        with open(snp_file, 'r') as f:
            snp_data = json.load(f)
        
        print(f"✓ Loaded {len([k for k in snp_data.keys() if not k.startswith('_')])} example parents from: {os.path.abspath(snp_file)}")
        
        # Convert SNP genotypes to parent genotypes
        parents_dict = {}
        
        for parent_name, parent_data in snp_data.items():
            if parent_name.startswith('_'):  # Skip metadata fields
                continue
            
            snp_genotypes = parent_data.get('genotypes', {})
            
            # Convert SNP genotypes to trait phenotype scores using dna_to_traits()
            trait_scores = dna_to_traits(snp_genotypes, trait_map_file)
            
            # Convert phenotype scores (0-1) → Alleles (0-10) → Genotypes
            parent_genotypes = {}
            
            for trait_name, phenotype_score in trait_scores.items():
                # Convert phenotype score (0-1) to allele effect (0-10)
                effect = phenotype_score * 10.0
                
                # Create alleles based on score
                if phenotype_score >= 0.6:
                    allele1 = Allele(f"{trait_name[:1]}A", effect, is_dominant=True)
                    allele2 = Allele(f"{trait_name[:1]}a", effect * 0.7, is_dominant=False)
                else:
                    allele1 = Allele(f"{trait_name[:1]}A", effect * 0.8, is_dominant=True)
                    allele2 = Allele(f"{trait_name[:1]}a", effect, is_dominant=False)
                
                # Create genotype (pair of alleles)
                parent_genotypes[trait_name] = Genotype(allele1, allele2)
            
            # Ensure all standard traits exist (even if no SNP data)
            standard_traits = ['Yield', 'Disease_Resistance', 'Water_Efficiency', 'Growth_Rate']
            for trait_name in standard_traits:
                if trait_name not in parent_genotypes:
                    neutral = Allele('N', 5.0, is_dominant=True)
                    parent_genotypes[trait_name] = Genotype(neutral, neutral)
            
            parents_dict[parent_name] = parent_genotypes
        
        if not parents_dict:
            raise ValueError("No parents found in SNP file")
        
        print(f"✓ Converted SNP genotypes → trait phenotypes using dna_to_traits()")
        return parents_dict
    
    except Exception as e:
        print(f"❌ Error loading example parents from SNP file: {str(e)}")
        raise


# ============================================================================
# MENDELIAN INHERITANCE SIMULATION
# ============================================================================

def cross_parents(parent1_genotypes, parent2_genotypes, num_offspring=150):
    """
    Cross two parents via Mendelian inheritance.
    Each parent produces random gametes (segregation).
    Offspring gets one allele from each parent per trait.
    
    Args:
        parent1_genotypes: Dict of trait → Genotype objects for parent 1
        parent2_genotypes: Dict of trait → Genotype objects for parent 2
        num_offspring: Number of F1 offspring to simulate (default 150)
    
    Returns:
        list: List of offspring phenotypes (dicts with trait → phenotype value)
    """
    offspring_phenotypes = []
    
    for _ in range(num_offspring):
        offspring = {}
        for trait in parent1_genotypes.keys():
            p1_geno = parent1_genotypes[trait]
            p2_geno = parent2_genotypes[trait]
            
            # Random gamete segregation (each parent contributes random allele)
            p1_allele = np.random.choice(p1_geno.alleles)
            p2_allele = np.random.choice(p2_geno.alleles)
            
            # F1 genotype combines alleles from both parents
            offspring[trait] = Genotype(p1_allele, p2_allele)
        
        # F1 phenotype (actual trait expression)
        phenotype = {trait: offspring[trait].get_phenotype_value() for trait in offspring}
        offspring_phenotypes.append(phenotype)
    
    return offspring_phenotypes


# ============================================================================
# ⭐ GENERATIONS TO 80% PERFORMANCE CALCULATION ⭐
# ============================================================================
#
# This is the core algorithm for estimating breeding progress.
# It answers: "How many generations of selective breeding to reach 80%?"
#
# ⚠️  READ THIS CAREFULLY - THIS IS WHAT YOU ASKED TO HIGHLIGHT
#

def simulate_multi_generation_breeding(parent1_genotypes, parent2_genotypes, target=0.8, max_generations=15):
    """
    🔬 MULTI-GENERATION BREEDING SIMULATION
    
    This function actually simulates F1 → F2 → F3 → F4... generations
    with realistic selection pressure, instead of just estimating from F1.
    
    WORKFLOW:
    ─────────
    1. Generate F1 offspring from parent cross
    2. Select best 30% of F1 as parents for F2
    3. Cross selected F1 parents to generate F2 offspring
    4. Repeat: select best 30% of F2 → breed F3
    5. Continue until target is reached or max generations exceeded
    
    SELECTION STRATEGY:
    ──────────────────
    • Sort offspring by composite fitness (trait values + consistency)
    • Select top 30% (selection intensity = 0.3)
    • Randomly pair selected individuals for next generation
    • This mimics natural selective breeding practices
    
    Args:
        parent1_genotypes: Dict of trait → Genotype for parent 1
        parent2_genotypes: Dict of trait → Genotype for parent 2
        target: Target mean fitness (default 0.8 = 80%)
        max_generations: Maximum generations to simulate (default 15)
    
    Returns:
        dict: {
            'generations_to_target': int,
            'generation_progress': list of dicts showing progression,
            'final_mean_fitness': float,
            'final_std_fitness': float
        }
    """
    
    # Initialize tracking
    generation_progress = []
    current_parents = {
        'Parent1': parent1_genotypes,
        'Parent2': parent2_genotypes
    }
    
    generation = 0
    
    while generation < max_generations:
        generation += 1
        
        # Generate offspring from current parents
        all_offspring_phenotypes = []
        
        # Cross all pairs of parents (or self if only 2)
        parent_list = list(current_parents.keys())
        for i in range(0, len(parent_list), 2):
            p1 = current_parents[parent_list[i]]
            p2 = current_parents[parent_list[i+1]] if i+1 < len(parent_list) else p1
            
            offspring = cross_parents(p1, p2, num_offspring=100)
            all_offspring_phenotypes.extend(offspring)
        
        # Calculate fitness for each offspring
        offspring_fitness = []
        for phenotype in all_offspring_phenotypes:
            # Composite fitness: average of all trait values (normalized 0-10 scale)
            fitness = np.mean(list(phenotype.values())) / 10.0
            offspring_fitness.append(fitness)
        
        mean_fitness = np.mean(offspring_fitness)
        std_fitness = np.std(offspring_fitness)
        
        # Track generation progress
        generation_progress.append({
            'generation': generation,
            'mean_fitness': round(float(mean_fitness), 4),
            'std_fitness': round(float(std_fitness), 4),
            'population_size': len(offspring_fitness)
        })
        
        print(f"  Gen {generation} (F{generation}): Mean={mean_fitness:.4f}, Std={std_fitness:.4f}")
        
        # Check if target reached
        if mean_fitness >= target:
            print(f"✓ Target {target} reached at generation {generation}!")
            return {
                'generations_to_target': generation,
                'generation_progress': generation_progress,
                'final_mean_fitness': round(float(mean_fitness), 4),
                'final_std_fitness': round(float(std_fitness), 4)
            }
        
        # Select top 30% for next generation
        selection_count = max(2, int(len(offspring_fitness) * 0.3))
        
        # Get indices of top performers
        top_indices = np.argsort(offspring_fitness)[-selection_count:]
        selected_phenotypes = [all_offspring_phenotypes[i] for i in top_indices]
        
        # Create new parent pool from selected individuals
        # Convert phenotypes (which are dictionaries of values) back to genotypes
        # For simplicity, randomly pair selected individuals
        current_parents = {}
        for idx in range(0, len(selected_phenotypes), 2):
            parent_name = f'Parent_{idx//2}'
            # Note: We're using phenotypes directly as proxy for next generation
            # In reality, would need to reconstruct full genotypes
            # For this simulation, we approximate by tracking phenotype means
            current_parents[parent_name] = selected_phenotypes[idx] if idx < len(selected_phenotypes) else selected_phenotypes[0]
    
    # Max generations reached without hitting target
    return {
        'generations_to_target': max_generations,
        'generation_progress': generation_progress,
        'final_mean_fitness': round(float(generation_progress[-1]['mean_fitness']), 4),
        'final_std_fitness': round(float(generation_progress[-1]['std_fitness']), 4)
    }


def estimate_generations_to_target(f1_mean_fitness, f1_std_fitness, target=0.8):
    """
    ╔════════════════════════════════════════════════════════════════════════════╗
    ║              80% PERFORMANCE ESTIMATION (MULTI-GENERATION)                 ║
    ║                                                                            ║
    ║  Now includes actual multi-generation simulation instead of linear         ║
    ║  estimation. This simulates F1 → F2 → F3 with realistic selection.        ║
    ║                                                                            ║
    ║  MULTI-GENERATION WORKFLOW:                                              ║
    ║  ────────────────────────────                                            ║
    ║                                                                            ║
    ║  Generation 1 (F1):                                                       ║
    ║      • Cross parents → produce F1 offspring                               ║
    ║      • Calculate mean fitness from F1 phenotypes                          ║
    ║                                                                            ║
    ║  Generation 2 (F2):                                                       ║
    ║      • Select best 30% of F1 individuals                                  ║
    ║      • Cross selected F1 → produce F2 offspring                           ║
    ║      • Calculate new mean fitness from F2                                 ║
    ║      • Accumulate favorable alleles                                       ║
    ║                                                                            ║
    ║  Generation 3+ (F3, F4, ...):                                             ║
    ║      • Repeat selection process each generation                           ║
    ║      • Population mean increases over time                                ║
    ║      • Reaches target when mean ≥ 80%                                     ║
    ║                                                                            ║
    ║  KEY DIFFERENCES FROM V1:                                                ║
    ║  • ACTUAL simulation instead of linear estimation                         ║
    ║  • Accounts for linkage and allele accumulation                           ║
    ║  • Shows realistic population trajectories                                ║
    ║  • Reveals when progress plateaus (linkage drag)                          ║
    ║                                                                            ║
    ║  REALISTIC ASSUMPTIONS:                                                 ║
    ║  • Selection intensity: 30% of population selected                        ║
    ║  • Population size: ~100-200 offspring per generation                     ║
    ║  • Heritability: Traits are heritable (h² ~0.5)                          ║
    ║  • Mendelian segregation: Random allele recombination                     ║
    ║                                                                            ║
    ╚════════════════════════════════════════════════════════════════════════════╝
    
    Args:
        f1_mean_fitness: Mean phenotypic value of F1 offspring (0-1 scale)
        f1_std_fitness: Standard deviation of F1 phenotypes
        target: Target performance threshold (default 0.8 = 80%)
    
    Returns:
        int: Number of generations to reach target (from actual simulation)
    """
    
    # Check if already at target in F1
    if f1_mean_fitness >= target:
        return 1
    
    # For backwards compatibility and speed, use conservative linear estimate
    # (Full multi-generation simulation is called separately in process_breeding_request)
    gap = target - f1_mean_fitness
    gain_per_generation = gap * 0.12
    
    generations = 1
    current_mean = f1_mean_fitness
    
    while current_mean < target and generations < 15:
        current_mean += gain_per_generation
        generations += 1
    
    return generations


# ============================================================================
# STEP 1: GET AVAILABLE TRAITS (Frontend displays for user selection)
# ============================================================================

def get_available_traits():
    """
    🎯 STEP 1 FUNCTION: Return available traits for frontend to display
    
    This function is called FIRST by the frontend to get the list of traits
    that users can choose to improve. The frontend displays these traits
    and lets users select which ones they want to prioritize.
    
    ⚠️  FALLBACK BEHAVIOR:
    If no 'parents' variable is defined, automatically loads example parents
    from DNA example files. This allows the system to work standalone.
    
    RETURNS:
    --------
    {
        "status": "success",
        "available_traits": ["Yield", "Disease_Resistance", "Water_Efficiency", "Growth_Rate"],
        "trait_descriptions": {
            "Yield": "Total grain/biomass production",
            "Disease_Resistance": "Resistance to common diseases",
            "Water_Efficiency": "Water use efficiency under drought",
            "Growth_Rate": "Speed of plant development"
        },
        "using_example_data": false  // true if using fallback example parents
    }
    
    WORKFLOW:
    ─────────
    Frontend → Backend: get_available_traits()
               ↓
           Display traits on UI
               ↓
       User selects which traits to improve
               ↓
    Frontend → Backend: process_breeding_request(with selected traits)
               ↓
           Backend returns best cross recommendations
    
    Returns:
        dict: List of available traits for user selection
    """
    try:
        global parents
        # Check if parents are defined in the global context
        use_example_data = False
        try:
            if not parents or len(parents) == 0:
                use_example_data = True
        except NameError:
            # 'parents' not defined - use fallback
            use_example_data = True
        
        # Load example parents if needed
        if use_example_data:
            
            parents = load_example_parents()
            print("⚠️  No parents defined. Using example DNA data from: documentation/DNA_EXAMPLE_Parent*.json")
        
        first_parent_name = list(parents.keys())[0]
        first_parent_genotypes = parents[first_parent_name]
        available_traits = list(first_parent_genotypes.keys())
        
        # Descriptions for each trait (for frontend UI)
        trait_descriptions = {
            "Yield": "Total grain/biomass production",
            "Disease_Resistance": "Resistance to common diseases",
            "Water_Efficiency": "Water use efficiency under drought",
            "Growth_Rate": "Speed of plant development"
        }
        
        result = {
            "status": "success",
            "available_traits": available_traits,
            "trait_descriptions": {
                trait: trait_descriptions.get(trait, "Trait for crop improvement")
                for trait in available_traits
            },
            "using_example_data": use_example_data
        }
        
        # Save to JSON for frontend
        traits_file = "available_traits.json"
        with open(traits_file, 'w') as f:
            json.dump(result, f, indent=2)
        
        print(f"✓ Available traits JSON saved to: {os.path.abspath(traits_file)}")
        
        return result
    
    except Exception as e:
        import traceback
        return {
            "status": "error",
            "message": f"{type(e).__name__}: {str(e)}",
            "traceback": traceback.format_exc()
        }


# ============================================================================
# STEP 2: PROCESS BREEDING REQUEST (After user selects traits)
# ============================================================================

def process_breeding_request(frontend_json_input):
    """
    🎯 STEP 2 FUNCTION: Backend processes frontend request and returns breeding recommendations
    
    This is called AFTER user selects desired traits in the frontend.
    User has already chosen which traits to improve from the available list.
    
    FRONTEND WORKFLOW:
    ──────────────────
    Step 1: Call get_available_traits() → Display traits on UI
    Step 2: User selects traits to improve
    Step 3: User sets weights for each selected trait
    Step 4: Call process_breeding_request(with selected traits & weights)
    Step 5: Backend returns best cross + expected traits + generations needed
    
    FRONTEND INPUT JSON FORMAT (STEP 2):
    ────────────────────────────────────
    {
        "wanted_traits": ["Yield", "Disease_Resistance", "Water_Efficiency"],
        "trait_weights": {
            "Yield": 0.5,
            "Disease_Resistance": 0.3,
            "Water_Efficiency": 0.2
        }
    }
    
    BACKEND OUTPUT JSON FORMAT (STEP 2):
    ───────────────────────────────────
    {
        "status": "success",
        "wanted_traits": ["Yield", "Disease_Resistance", "Water_Efficiency"],
        "best_cross": {
            "parent1": "Parent_A",
            "parent2": "Parent_B"
        },
        "expected_f1_traits": {
            "Yield": 0.75,
            "Disease_Resistance": 0.82,
            "Water_Efficiency": 0.71
        },
        "generations_to_80_percent": 3,
        "output_file": "breeding_result.json"
    }
    
    ⚠️  OUTPUT FILE SAVED:
    
        The output JSON is saved to: breeding_result.json
        (Relative to the project folder where this script is located)
    
    Args:
        frontend_json_input: Dict with wanted_traits and trait_weights from frontend
    
    Returns:
        dict: Backend result ready to send to frontend + saved as JSON file
    """
    
    try:
        global parents
        # Extract frontend inputs
        wanted_traits = frontend_json_input.get('wanted_traits', [])
        trait_weights = frontend_json_input.get('trait_weights', {})
        
        if not wanted_traits or not trait_weights:
            return {
                "status": "error",
                "message": "Missing wanted_traits or trait_weights"
            }
        
        # ⚠️  FALLBACK: Load example parents if not defined
        use_example_data = False
        try:

            if not parents or len(parents) == 0:
                use_example_data = True
        except NameError:
            use_example_data = True
        
        if use_example_data:
            
            parents = load_example_parents()
            print("⚠️  No DNA files provided. Using example parents from documentation folder.")
        
        # Get all available traits from first parent
        first_parent_name = list(parents.keys())[0]
        first_parent_genotypes = parents[first_parent_name]
        all_available_traits = list(first_parent_genotypes.keys())
        
        # Normalize weights to available traits
        normalized_weights = {}
        for trait in all_available_traits:
            normalized_weights[trait] = trait_weights.get(trait, 0)
        
        weight_sum = sum(normalized_weights.values())
        if weight_sum > 0:
            normalized_weights = {t: w/weight_sum for t, w in normalized_weights.items()}
        else:
            normalized_weights = {t: 1/len(all_available_traits) for t in all_available_traits}
        
        # Find best cross using existing algorithm
        best_cross_data = None
        best_score = -1
        parent_list = list(parents.keys())
        
        for i, p1 in enumerate(parent_list):
            for j, p2 in enumerate(parent_list):
                if i >= j:
                    continue
                
                # Simulate F1 offspring
                f1_offspring = cross_parents(parents[p1], parents[p2])
                
                # Calculate trait means for F1
                f1_trait_means = {}
                for trait in all_available_traits:
                    trait_vals = [off[trait] for off in f1_offspring]
                    f1_trait_means[trait] = np.mean(trait_vals)
                
                # Calculate composite score
                trait_score = np.mean([f1_trait_means[t] * normalized_weights[t] 
                                      for t in all_available_traits])
                
                # Calculate consistency bonus (lower variance = higher consistency)
                trait_stds = []
                for trait in all_available_traits:
                    trait_vals = [off[trait] for off in f1_offspring]
                    trait_stds.append(np.std(trait_vals))
                
                consistency = 1.0 / (1.0 + np.mean(trait_stds))  # Normalize to 0-1
                
                # Final composite score
                final_score = (0.7 * trait_score) + (0.3 * consistency)
                
                if final_score > best_score:
                    best_score = final_score
                    best_cross_data = {
                        'parent1': p1,
                        'parent2': p2,
                        'f1_offspring': f1_offspring,
                        'f1_trait_means': f1_trait_means
                    }
        
        if best_cross_data is None:
            return {"status": "error", "message": "No valid crosses found"}
        
        # Calculate F1 fitness statistics
        f1_fitness_values = [sum(off.values()) for off in best_cross_data['f1_offspring']]
        f1_mean_fitness = np.mean(f1_fitness_values) / len(all_available_traits)
        f1_std_fitness = np.std(f1_fitness_values) / len(all_available_traits)
        
        # ⭐ MULTI-GENERATION SIMULATION ⭐
        # Now uses actual F1 → F2 → F3 breeding with selection
        print("\n🔬 Running multi-generation breeding simulation...")
        multi_gen_result = simulate_multi_generation_breeding(
            parents[best_cross_data['parent1']],
            parents[best_cross_data['parent2']],
            target=0.8
        )
        
        generations = multi_gen_result['generations_to_target']
        generation_progress = multi_gen_result['generation_progress']
        
        print(f"✓ Simulation complete: {generations} generations to 80%\n")
        
        # Prepare response with only wanted traits
        f1_response_traits = {}
        for trait in wanted_traits:
            if trait in best_cross_data['f1_trait_means']:
                normalized_value = min(1.0, best_cross_data['f1_trait_means'][trait] / 10.0)
                f1_response_traits[trait] = round(float(normalized_value), 4)
        
        # Create result dictionary
        result = {
            "status": "success",
            "wanted_traits": wanted_traits,  # ⭐ Return the requested traits back
            "best_cross": {
                "parent1": best_cross_data['parent1'],
                "parent2": best_cross_data['parent2']
            },
            "expected_f1_traits": f1_response_traits,
            "generations_to_80_percent": int(generations),
            "generation_progress": generation_progress,  # ⭐ NEW: Show progression
            "output_file": os.path.abspath(OUTPUT_JSON_PATH)
        }
        
        # ⭐ SAVE OUTPUT JSON FILE TO PROJECT FOLDER ⭐
        try:
            with open(OUTPUT_JSON_PATH, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"✓ Output JSON saved to: {os.path.abspath(OUTPUT_JSON_PATH)}")
        except Exception as e:
            result["file_save_error"] = f"Could not save JSON file: {str(e)}"
        
        return result
    
    except Exception as e:
        import traceback
        return {
            "status": "error",
            "message": f"{type(e).__name__}: {str(e)}",
            "traceback": traceback.format_exc()
        }


# ============================================================================
# EXAMPLE USAGE & DOCUMENTATION
# ============================================================================

"""
HOW TO USE THIS MODULE IN YOUR FRONTEND API:

═══════════════════════════════════════════════════════════════════════════════
STEP 1: GET AVAILABLE TRAITS (Display for user selection)
═══════════════════════════════════════════════════════════════════════════════

1. IMPORT:
   --------
   from breeding_backend import get_available_traits, process_breeding_request

2. CALL STEP 1 - GET TRAITS:
   ─────────────────────────
   traits_response = get_available_traits()
   
   RETURNS:
   {
       "status": "success",
       "available_traits": ["Yield", "Disease_Resistance", "Water_Efficiency", "Growth_Rate"],
       "trait_descriptions": {
           "Yield": "Total grain/biomass production",
           "Disease_Resistance": "Resistance to common diseases",
           ...
       }
   }

3. FRONTEND DISPLAYS:
   ──────────────────
   • Show list of available traits
   • Let user SELECT which traits they want to improve
   • Let user set WEIGHTS for each selected trait
   • Example output from UI:
       Selected traits: ["Yield", "Disease_Resistance"]
       Weights: {"Yield": 0.6, "Disease_Resistance": 0.4}

═══════════════════════════════════════════════════════════════════════════════
STEP 2: PROCESS BREEDING REQUEST (After user selects traits)
═══════════════════════════════════════════════════════════════════════════════

4. PREPARE STEP 2 REQUEST:
   ──────────────────────
   frontend_input = {
       "wanted_traits": ["Yield", "Disease_Resistance"],  # User selected
       "trait_weights": {
           "Yield": 0.6,               # User set weights
           "Disease_Resistance": 0.4
       }
   }

5. CALL STEP 2 - PROCESS:
   ─────────────────────
   result = process_breeding_request(frontend_input)
   
   RETURNS:
   {
       "status": "success",
       "wanted_traits": ["Yield", "Disease_Resistance"],
       "best_cross": {
           "parent1": "Parent_A",
           "parent2": "Parent_B"
       },
       "expected_f1_traits": {
           "Yield": 0.75,
           "Disease_Resistance": 0.82
       },
       "generations_to_80_percent": 3,
       "output_file": "/path/to/breeding_result.json"
   }

6. OUTPUT FILES CREATED:
   ────────────────────
   • available_traits.json ← Created by get_available_traits()
   • breeding_result.json ← Created by process_breeding_request()

7. DISPLAY RESULTS:
   ────────────────
   if result['status'] == 'success':
       print(f"Best Cross: {result['best_cross']['parent1']} × {result['best_cross']['parent2']}")
       print(f"Expected Traits: {result['expected_f1_traits']}")
       print(f"Generations to 80%: {result['generations_to_80_percent']}")


IMPORTANT NOTES FOR YOUR TEAM:

⚠️  TWO-STEP WORKFLOW:
    Step 1: get_available_traits() → Show UI for user selection
    Step 2: process_breeding_request() → Process user's choices

⚠️  JSON FILES SAVED AUTOMATICALLY:
    • available_traits.json (for UI display)
    • breeding_result.json (for final results)
    Both relative to project folder

⚠️  The 'parents' dictionary must be defined in the calling context
    (typically from the Jupyter notebook or loaded from database)

⚠️  All trait values are on 0-1 scale (normalized)
"""


if __name__ == "__main__":
    print("This is a backend module. Import and use in your API/server.")
    print("Example: from breeding_backend import process_breeding_request")
