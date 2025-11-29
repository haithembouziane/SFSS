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
        if a1.name == a2.name:       # homozygous
            return a1.effect
        elif a1.is_dominant:         # heterozygous, dominant expressed
            return a1.effect
        else:                         # both recessive
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
    offspring_phenotypes = []
    for _ in range(num_offspring):
        offspring = {}
        for trait in parent1_genotypes.keys():
            p1_geno = parent1_genotypes[trait]
            p2_geno = parent2_genotypes[trait]
            p1_allele = np.random.choice(p1_geno.alleles)
            p2_allele = np.random.choice(p2_geno.alleles)
            offspring[trait] = Genotype(p1_allele, p2_allele)
        phenotype = {trait: offspring[trait].get_phenotype_value() for trait in offspring}
        offspring_phenotypes.append(phenotype)
    return offspring_phenotypes


# ----------------- MAIN ENTRY: auto trait_weights ----------------- #

def run_breeding_pipeline(user_json=None):
    """
    user_json: dict from frontend (e.g. uploaded available_traits.json).
    For now we ignore detailed content and just:
      - load example parents
      - auto-define wanted_traits and equal trait_weights
      - return best cross and F1-based estimate
    """
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

            # F1 simulation
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

    # Simple “generations to 80%” estimate based on F1 mean fitness
    f1_fitness_values = [
        np.mean(list(off.values())) / 10.0 for off in best_cross_data["f1_offspring"]
    ]
    f1_mean_fitness = float(np.mean(f1_fitness_values))
    # naive estimate: if already ≥0.8 → 1, else a small fixed number
    if f1_mean_fitness >= 0.8:
        generations_estimate = 1
    else:
        generations_estimate = 3  # simple placeholder

    # Response traits (normalized 0–1)
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
        "expected_f1_traits": f1_response_traits,
        "generations_to_80_percent": int(generations_estimate),
        "output_file": os.path.abspath(OUTPUT_JSON_PATH),
        "f1_mean_fitness": round(f1_mean_fitness, 4),
    }

    # Save to JSON file
    try:
        with open(OUTPUT_JSON_PATH, "w") as f:
            json.dump(result, f, indent=2)
    except Exception:
        pass

    return result
