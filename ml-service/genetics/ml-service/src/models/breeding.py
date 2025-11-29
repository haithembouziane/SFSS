# ml-service/src/models/breeding.py
import numpy as np
import json
import os

# Base directory = folder where this breeding.py file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths relative to this file
OUTPUT_JSON_PATH = os.path.join(BASE_DIR, "breeding_result.json")
EXAMPLE_PARENTS_SNP_FILE = os.path.join(BASE_DIR, "example_parents_snp.json")
EXAMPLE_TRAIT_MAP_FILE = os.path.join(BASE_DIR, "dna_trait_map.json")


# ----------------- Genetic classes ----------------- #

class Allele:
    def __init__(self, name, effect, is_dominant=True):
        self.name = name
        self.effect = effect  # 0-10 scale
        self.is_dominant = is_dominant

    def __repr__(self):
        return self.name


class Genotype:
    def __init__(self, allele1, allele2):
        # sort so dominant alleles come first (just for consistency)
        self.alleles = tuple(
            sorted([allele1, allele2], key=lambda a: (not a.is_dominant, a.name))
        )

    def get_phenotype_value(self):
        a1, a2 = self.alleles
        if a1.name == a2.name:  # homozygous
            return a1.effect
        elif a1.is_dominant:  # heterozygous, dominant expressed
            return a1.effect
        else:  # both recessive
            return (a1.effect + a2.effect) / 2

    def __repr__(self):
        return f"{self.alleles[0].name}{self.alleles[1].name}"


# ----------------- DNA to traits ----------------- #

def dna_to_traits(dna_snps, trait_map_path=EXAMPLE_TRAIT_MAP_FILE):
    if not os.path.exists(trait_map_path):
        raise FileNotFoundError(f"Trait map file not found: {trait_map_path}")

    with open(trait_map_path, "r") as f:
        trait_map = json.load(f)

    # Remove metadata entries
    trait_map = {k: v for k, v in trait_map.items() if not k.startswith("_")}

    traits = {}
    for snp_id, genotype in dna_snps.items():
        if snp_id not in trait_map:
            continue
        snp_info = trait_map[snp_id]
        trait_name = snp_info["trait"]
        if genotype not in snp_info:
            continue
        score = snp_info[genotype]
        traits.setdefault(trait_name, []).append(score)

    final_traits = {
        trait: sum(scores) / len(scores) for trait, scores in traits.items()
    }
    return final_traits


def load_example_parents(
    snp_file=EXAMPLE_PARENTS_SNP_FILE, trait_map_file=EXAMPLE_TRAIT_MAP_FILE
):
    if not os.path.exists(snp_file):
        raise FileNotFoundError(f"SNP file not found: {snp_file}")

    with open(snp_file, "r") as f:
        snp_data = json.load(f)

    parents_dict = {}
    for parent_name, parent_data in snp_data.items():
        if parent_name.startswith("_"):
            continue

        snp_genotypes = parent_data.get("genotypes", {})
        trait_scores = dna_to_traits(snp_genotypes, trait_map_file)

        parent_genotypes = {}
        for trait_name, phenotype_score in trait_scores.items():
            effect = phenotype_score * 10.0
            if phenotype_score >= 0.6:
                allele1 = Allele(f"{trait_name[:1]}A", effect, True)
                allele2 = Allele(f"{trait_name[:1]}a", effect * 0.7, False)
            else:
                allele1 = Allele(f"{trait_name[:1]}A", effect * 0.8, True)
                allele2 = Allele(f"{trait_name[:1]}a", effect, False)
            parent_genotypes[trait_name] = Genotype(allele1, allele2)

        # ensure all 4 main traits exist
        standard_traits = ["Yield", "Disease_Resistance", "Water_Efficiency", "Growth_Rate"]
        for trait_name in standard_traits:
            if trait_name not in parent_genotypes:
                neutral = Allele("N", 5.0, True)
                parent_genotypes[trait_name] = Genotype(neutral, neutral)

        parents_dict[parent_name] = parent_genotypes

    if not parents_dict:
        raise ValueError("No parents found in SNP file")

    return parents_dict


# ----------------- Mendelian crossing (F1 only) ----------------- #

def cross_parents(parent1_genotypes, parent2_genotypes, num_offspring=150):
    """
    Original helper preserved for compatibility: returns a list of phenotype dicts
    (trait -> phenotype_value).
    """
    offspring_phenotypes = []
    for _ in range(num_offspring):
        offspring = {}
        for trait in parent1_genotypes.keys():
            p1_geno = parent1_genotypes[trait]
            p2_geno = parent2_genotypes[trait]
            p1_allele = np.random.choice(p1_geno.alleles)
            p2_allele = np.random.choice(p2_geno.alleles)
            child_geno = Genotype(p1_allele, p2_allele)
            offspring[trait] = child_geno.get_phenotype_value()
        offspring_phenotypes.append(offspring)
    return offspring_phenotypes


def cross_parents_genotypes(parent1_genotypes, parent2_genotypes, num_offspring=150):
    """
    Returns the actual offspring genotype objects (trait -> Genotype).
    This is necessary for allele-preserving multi-generation simulations.
    """
    offspring_genotypes = []
    for _ in range(num_offspring):
        offspring = {}
        for trait in parent1_genotypes.keys():
            p1_geno = parent1_genotypes[trait]
            p2_geno = parent2_genotypes[trait]
            p1_allele = np.random.choice(p1_geno.alleles)
            p2_allele = np.random.choice(p2_geno.alleles)
            offspring[trait] = Genotype(p1_allele, p2_allele)
        offspring_genotypes.append(offspring)
    return offspring_genotypes


# ----------------- Multi-generation: Option B (Realistic) ----------------- #

def simulate_multi_generation_breeding_realistic(
    parent1_genotypes,
    parent2_genotypes,
    target=0.8,
    max_generations=15,
    num_offspring_per_cross=200,
    selection_intensity=0.3,
    verbose=False,
):
    """
    Realistic MULTI-GENERATION BREEDING SIMULATION (Option B)
    - Preserves full Genotype objects across generations
    - Simulates allele-level inheritance each cross (via cross_parents_genotypes)
    - Selects top performers by phenotype, uses selected genotypes as next-parent pool
    - Returns generation progression and final trait means (trait values are 0-10)
    """
    generation_progress = []

    current_parent_pool = [parent1_genotypes, parent2_genotypes]
    generation = 0

    while generation < max_generations:
        generation += 1

        # generate offspring by crossing pairs in current_parent_pool
        all_offspring_genotypes = []
        for i in range(0, len(current_parent_pool), 2):
            p1 = current_parent_pool[i]
            p2 = current_parent_pool[i + 1] if i + 1 < len(current_parent_pool) else p1
            offspring_genos = cross_parents_genotypes(p1, p2, num_offspring=num_offspring_per_cross)
            all_offspring_genotypes.extend(offspring_genos)

        # compute phenotype & fitness for each offspring genotype
        offspring_fitness = []
        offspring_phenotypes = []
        for geno in all_offspring_genotypes:
            phen_vals = {t: geno[t].get_phenotype_value() for t in geno}
            fitness = np.mean(list(phen_vals.values())) / 10.0  # normalized 0..1
            offspring_fitness.append(fitness)
            offspring_phenotypes.append((geno, phen_vals))

        if len(offspring_fitness) == 0:
            break

        mean_fitness = float(np.mean(offspring_fitness))
        std_fitness = float(np.std(offspring_fitness))

        # store both naming variants (compatibility with older frontend)
        generation_progress.append({
            'generation': generation,
            'mean_fitness': round(mean_fitness, 4),
            'std_fitness': round(std_fitness, 4),
            'mean': round(mean_fitness, 4),
            'std': round(std_fitness, 4),
            'population_size': len(offspring_fitness)
        })

        if verbose:
            print(f"  Realistic Gen {generation} (F{generation}): Mean={mean_fitness:.4f}, Std={std_fitness:.4f}")

        # check target
        if mean_fitness >= target:
            if verbose:
                print(f"✓ Target {target} reached at generation {generation} (realistic).")

            # compute final trait means (0-10 scale) for the generation that met target
            final_trait_means = {}
            if len(all_offspring_genotypes) > 0:
                trait_names = list(all_offspring_genotypes[0].keys())
                for trait in trait_names:
                    vals = [geno[trait].get_phenotype_value() for geno in all_offspring_genotypes]
                    final_trait_means[trait] = float(np.mean(vals))

            return {
                'generations_to_target': generation,
                'generation_progress': generation_progress,
                'final_mean_fitness': round(mean_fitness, 4),
                'final_std_fitness': round(std_fitness, 4),
                'final_trait_means': final_trait_means
            }

        # selection: choose top fraction of offspring (by fitness)
        selection_count = max(2, int(len(offspring_fitness) * selection_intensity))
        top_indices = np.argsort(offspring_fitness)[-selection_count:]
        selected_genotypes = [all_offspring_genotypes[i] for i in top_indices]

        # shuffle and pair selected genotypes to make next parent pool
        np.random.shuffle(selected_genotypes)
        next_parent_pool = []
        for i in range(0, len(selected_genotypes), 2):
            g1 = selected_genotypes[i]
            g2 = selected_genotypes[i + 1] if i + 1 < len(selected_genotypes) else g1
            next_parent_pool.append(g1)
            next_parent_pool.append(g2)

        # cap parent pool to maintain reasonable compute cost
        if len(next_parent_pool) > 20:
            next_parent_pool = next_parent_pool[:20]

        current_parent_pool = next_parent_pool

    # max generations reached without hitting target
    if generation_progress:
        last = generation_progress[-1]
        # compute final trait means from the last produced offspring set (if exists)
        final_trait_means = {}
        if 'all_offspring_genotypes' in locals() and len(all_offspring_genotypes) > 0:
            trait_names = list(all_offspring_genotypes[0].keys())
            for trait in trait_names:
                vals = [geno[trait].get_phenotype_value() for geno in all_offspring_genotypes]
                final_trait_means[trait] = float(np.mean(vals))

        return {
            'generations_to_target': max_generations,
            'generation_progress': generation_progress,
            'final_mean_fitness': round(float(last['mean_fitness']), 4),
            'final_std_fitness': round(float(last['std_fitness']), 4),
            'final_trait_means': final_trait_means
        }
    else:
        return {
            'generations_to_target': 0,
            'generation_progress': generation_progress,
            'final_mean_fitness': 0.0,
            'final_std_fitness': 0.0,
            'final_trait_means': {}
        }


# ----------------- Multi-generation: Option A (Simple phenotype-proxy) ----------------- #

def simulate_multi_generation_breeding_simple(parent1_genotypes, parent2_genotypes, target=0.8, max_generations=15, verbose=False):
    """
    Simple MULTI-GENERATION BREEDING SIMULATION (Option A)
    - Uses phenotype dictionaries only (no genotype preservation)
    - Returns final generation trait means (0-10 scale) for compatibility
    """
    generation_progress = []
    current_parents = {
        'Parent1': parent1_genotypes,
        'Parent2': parent2_genotypes
    }

    generation = 0
    last_all_offspring = []

    while generation < max_generations:
        generation += 1

        # Generate offspring from current parents
        all_offspring_phenotypes = []

        parent_list = list(current_parents.keys())
        for i in range(0, len(parent_list), 2):
            p1 = current_parents[parent_list[i]]
            p2 = current_parents[parent_list[i + 1]] if i + 1 < len(parent_list) else p1

            offspring = cross_parents(p1, p2, num_offspring=100)
            all_offspring_phenotypes.extend(offspring)

        last_all_offspring = all_offspring_phenotypes

        # Calculate fitness for each offspring
        offspring_fitness = []
        for phenotype in all_offspring_phenotypes:
            fitness = np.mean(list(phenotype.values())) / 10.0
            offspring_fitness.append(fitness)

        mean_fitness = np.mean(offspring_fitness) if len(offspring_fitness) > 0 else 0.0
        std_fitness = np.std(offspring_fitness) if len(offspring_fitness) > 0 else 0.0

        generation_progress.append({
            'generation': generation,
            'mean_fitness': round(float(mean_fitness), 4),
            'std_fitness': round(float(std_fitness), 4),
            'mean': round(float(mean_fitness), 4),
            'std': round(float(std_fitness), 4),
            'population_size': len(offspring_fitness)
        })

        if verbose:
            print(f"  Simple Gen {generation} (F{generation}): Mean={mean_fitness:.4f}, Std={std_fitness:.4f}")

        if mean_fitness >= target:
            if verbose:
                print(f"✓ Target {target} reached at generation {generation} (simple).")

            # final trait means (from all_offspring_phenotypes) - convert 0-10 scale
            final_trait_means = {}
            if len(all_offspring_phenotypes) > 0:
                trait_names = list(all_offspring_phenotypes[0].keys())
                for trait in trait_names:
                    vals = [p[trait] for p in all_offspring_phenotypes]
                    final_trait_means[trait] = float(np.mean(vals))

            return {
                'generations_to_target': generation,
                'generation_progress': generation_progress,
                'final_mean_fitness': round(float(mean_fitness), 4),
                'final_std_fitness': round(float(std_fitness), 4),
                'final_trait_means': final_trait_means
            }

        # selection top 30%
        selection_count = max(2, int(len(offspring_fitness) * 0.3))
        if len(offspring_fitness) == 0:
            break
        top_indices = np.argsort(offspring_fitness)[-selection_count:]
        selected_phenotypes = [all_offspring_phenotypes[i] for i in top_indices]

        # build next generation parent pool (phenotype proxies)
        current_parents = {}
        for idx in range(0, len(selected_phenotypes), 2):
            parent_name = f'Parent_{idx // 2}'
            current_parents[parent_name] = selected_phenotypes[idx] if idx < len(selected_phenotypes) else selected_phenotypes[0]

    # Max generations reached
    final_trait_means = {}
    if len(last_all_offspring) > 0:
        trait_names = list(last_all_offspring[0].keys())
        for trait in trait_names:
            vals = [p[trait] for p in last_all_offspring]
            final_trait_means[trait] = float(np.mean(vals))

    if generation_progress:
        last = generation_progress[-1]
        return {
            'generations_to_target': max_generations,
            'generation_progress': generation_progress,
            'final_mean_fitness': round(float(last['mean_fitness']), 4),
            'final_std_fitness': round(float(last['std_fitness']), 4),
            'final_trait_means': final_trait_means
        }
    else:
        return {
            'generations_to_target': 0,
            'generation_progress': generation_progress,
            'final_mean_fitness': 0.0,
            'final_std_fitness': 0.0,
            'final_trait_means': {}
        }


# ----------------- MAIN ENTRY: auto trait_weights ----------------- #

def run_breeding_pipeline(user_json=None, multi_mode='realistic'):
    """
    user_json: dict from frontend (e.g. uploaded available_traits.json).
    If user_json contains 'mode' or 'multi_mode' it will override multi_mode argument.
    Returns:
      - original expected_f1_traits (for compatibility)
      - multi_generation_result with final_trait_means (final generation trait means in 0-10)
      - final_generation_traits (same as final_trait_means)
    """
    # allow frontend to pass mode in user_json
    if isinstance(user_json, dict):
        mux_mode = user_json.get('multi_mode') or user_json.get('mode')
        if mux_mode in ('realistic', 'simple'):
            multi_mode = mux_mode

    parents = load_example_parents()
    parent_list = list(parents.keys())
    first_parent = parents[parent_list[0]]
    all_traits = list(first_parent.keys())

    # Automatically use all traits with equal internal weights
    wanted_traits = all_traits
    trait_weights = {t: 1.0 / len(all_traits) for t in all_traits}

    best_cross_data = None
    best_score = -1.0

    for i, p1 in enumerate(parent_list):
        for j, p2 in enumerate(parent_list):
            if i >= j:
                continue

            # F1 simulation (phenotypes)
            f1_offspring = cross_parents(parents[p1], parents[p2])
            f1_trait_means = {}
            for trait in all_traits:
                trait_vals = [off[trait] for off in f1_offspring]
                f1_trait_means[trait] = float(np.mean(trait_vals))

            # Weighted sum using internal trait_weights
            trait_score = 0.0
            for t in all_traits:
                trait_score += f1_trait_means[t] * trait_weights[t]
            trait_score /= 10.0  # normalize 0–1

            # Consistency bonus
            trait_stds = []
            for trait in all_traits:
                trait_vals = [off[trait] for off in f1_offspring]
                trait_stds.append(float(np.std(trait_vals)))
            consistency = 1.0 / (1.0 + np.mean(trait_stds))

            final_score = 0.7 * trait_score + 0.3 * consistency

            if final_score > best_score:
                best_score = final_score
                best_cross_data = {
                    "parent1": p1,
                    "parent2": p2,
                    "f1_offspring": f1_offspring,
                    "f1_trait_means": f1_trait_means,
                }

    if best_cross_data is None:
        return {"status": "error", "message": "No valid crosses found"}

    # Compute F1 mean fitness (phenotype-based)
    f1_fitness_values = [
        np.mean(list(off.values())) / 10.0 for off in best_cross_data["f1_offspring"]
    ]
    f1_mean_fitness = float(np.mean(f1_fitness_values)) if f1_fitness_values else 0.0

    # Choose simulation mode and run multi-generation simulation
    if multi_mode == 'realistic':
        multi_gen_result = simulate_multi_generation_breeding_realistic(
            parents[best_cross_data["parent1"]],
            parents[best_cross_data["parent2"]],
            target=0.8,
            verbose=False
        )
    else:
        multi_gen_result = simulate_multi_generation_breeding_simple(
            parents[best_cross_data["parent1"]],
            parents[best_cross_data["parent2"]],
            target=0.8,
            verbose=False
        )

    generations_estimate = multi_gen_result.get("generations_to_target", 3)
    final_generation_traits = multi_gen_result.get("final_trait_means", {})

    # Response traits (normalized 0–1 for compatibility)
    f1_response_traits = {}
    for trait in wanted_traits:
        if trait in best_cross_data["f1_trait_means"]:
            normalized_value = min(
                1.0, best_cross_data["f1_trait_means"][trait] / 10.0
            )
            f1_response_traits[trait] = round(float(normalized_value), 4)

    result = {
        "status": "success",
        "wanted_traits": wanted_traits,
        "best_cross": {
            "parent1": best_cross_data["parent1"],
            "parent2": best_cross_data["parent2"],
        },
        "expected_f1_traits": f1_response_traits,     # kept for compatibility (0-1 normalized)
        "generations_to_80_percent": int(generations_estimate),
        "f1_mean_fitness": round(f1_mean_fitness, 4),
        "multi_generation_result": multi_gen_result,  # contains final_trait_means (0-10)
        "final_generation_traits": final_generation_traits,  # easier top-level access (0-10)
        "output_file": os.path.abspath(OUTPUT_JSON_PATH),
    }

    # Save to JSON file
    try:
        with open(OUTPUT_JSON_PATH, "w") as f:
            json.dump(result, f, indent=2)
    except Exception:
        pass

    return result
