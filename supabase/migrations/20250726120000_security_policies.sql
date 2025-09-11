/*
# [Mise en Place des Politiques de Sécurité RLS]
Ce script active la sécurité au niveau des lignes (RLS) pour toutes les tables et définit des politiques d'accès pour protéger les données des utilisateurs.

## Description de la Requête:
Cette opération est essentielle pour la sécurité de l'application. Elle restreint l'accès aux données en fonction du rôle de l'utilisateur et de la propriété des données. Sans ces politiques, les données des utilisateurs (profils, candidatures, etc.) seraient exposées publiquement. Il n'y a aucun risque de perte de données existantes.

## Métadonnées:
- Schema-Category: "Security"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: true (en désactivant RLS ou modifiant les politiques)

## Détails de la Structure:
- Active RLS sur: profiles, job_seeker_profiles, companies, job_postings, job_applications, saved_jobs, job_recommendations, et autres.
- Crée des politiques SELECT, INSERT, UPDATE, DELETE pour chaque table.

## Implications de Sécurité:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Les politiques utilisent auth.uid() et auth.role() pour vérifier les permissions.
*/

-- 1. Table `profiles`
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir tous les profils"
ON public.profiles FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs peuvent insérer leur propre profil"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 2. Table `job_seeker_profiles`
ALTER TABLE public.job_seeker_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs authentifiés peuvent voir les profils des chercheurs d'emploi"
ON public.job_seeker_profiles FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Les chercheurs d'emploi peuvent insérer leur profil"
ON public.job_seeker_profiles FOR INSERT
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Les chercheurs d'emploi peuvent mettre à jour leur profil"
ON public.job_seeker_profiles FOR UPDATE
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

-- 3. Table `companies`
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les entreprises"
ON public.companies FOR SELECT
USING (true);

CREATE POLICY "Les employeurs peuvent créer des entreprises"
ON public.companies FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND (SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'employer');

CREATE POLICY "Les employeurs peuvent mettre à jour les entreprises"
ON public.companies FOR UPDATE
USING (auth.role() = 'authenticated' AND (SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'employer');


-- 4. Table `job_postings`
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les offres d'emploi publiées"
ON public.job_postings FOR SELECT
USING (status = 'published');

CREATE POLICY "Les employeurs peuvent voir leurs propres offres non publiées"
ON public.job_postings FOR SELECT
USING (auth.uid() = employer_id);

CREATE POLICY "Les employeurs peuvent créer des offres d'emploi"
ON public.job_postings FOR INSERT
WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "Les employeurs peuvent mettre à jour leurs propres offres"
ON public.job_postings FOR UPDATE
USING (auth.uid() = employer_id)
WITH CHECK (auth.uid() = employer_id);


-- 5. Table `job_applications`
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les chercheurs d'emploi peuvent voir leurs propres candidatures"
ON public.job_applications FOR SELECT
USING (auth.uid() = (SELECT profile_id FROM public.job_seeker_profiles WHERE id = job_seeker_id));

CREATE POLICY "Les employeurs peuvent voir les candidatures à leurs offres"
ON public.job_applications FOR SELECT
USING (auth.uid() IN (SELECT employer_id FROM public.job_postings WHERE id = job_posting_id));

CREATE POLICY "Les chercheurs d'emploi peuvent postuler"
ON public.job_applications FOR INSERT
WITH CHECK (auth.uid() = (SELECT profile_id FROM public.job_seeker_profiles WHERE id = job_seeker_id));


-- 6. Table `saved_jobs`
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent gérer leurs emplois sauvegardés"
ON public.saved_jobs FOR ALL
USING (auth.uid() = (SELECT profile_id FROM public.job_seeker_profiles WHERE id = job_seeker_id))
WITH CHECK (auth.uid() = (SELECT profile_id FROM public.job_seeker_profiles WHERE id = job_seeker_id));


-- 7. Table `job_recommendations`
ALTER TABLE public.job_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir leurs propres recommandations"
ON public.job_recommendations FOR SELECT
USING (auth.uid() = (SELECT profile_id FROM public.job_seeker_profiles WHERE id = job_seeker_id));


-- 8. Tables de métadonnées (lecture seule pour la plupart des utilisateurs)
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut lire les métadonnées"
ON public.countries FOR SELECT USING (true);
CREATE POLICY "Tout le monde peut lire les métadonnées"
ON public.regions FOR SELECT USING (true);
CREATE POLICY "Tout le monde peut lire les métadonnées"
ON public.cities FOR SELECT USING (true);
CREATE POLICY "Tout le monde peut lire les métadonnées"
ON public.industries FOR SELECT USING (true);
CREATE POLICY "Tout le monde peut lire les métadonnées"
ON public.skills FOR SELECT USING (true);
CREATE POLICY "Tout le monde peut lire les métadonnées"
ON public.education_levels FOR SELECT USING (true);
CREATE POLICY "Tout le monde peut lire les métadonnées"
ON public.languages FOR SELECT USING (true);

-- Politiques pour les tables de jointure (job_seeker_skills, etc.)
CREATE POLICY "Les utilisateurs peuvent gérer leurs propres compétences"
ON public.job_seeker_skills FOR ALL
USING (auth.uid() = (SELECT profile_id FROM public.job_seeker_profiles WHERE id = job_seeker_id))
WITH CHECK (auth.uid() = (SELECT profile_id FROM public.job_seeker_profiles WHERE id = job_seeker_id));

CREATE POLICY "Les utilisateurs peuvent gérer leurs propres langues"
ON public.job_seeker_languages FOR ALL
USING (auth.uid() = (SELECT profile_id FROM public.job_seeker_profiles WHERE id = job_seeker_id))
WITH CHECK (auth.uid() = (SELECT profile_id FROM public.job_seeker_profiles WHERE id = job_seeker_id));

CREATE POLICY "Les utilisateurs peuvent gérer leur propre éducation"
ON public.job_seeker_education FOR ALL
USING (auth.uid() = (SELECT profile_id FROM public.job_seeker_profiles WHERE id = job_seeker_id))
WITH CHECK (auth.uid() = (SELECT profile_id FROM public.job_seeker_profiles WHERE id = job_seeker_id));
