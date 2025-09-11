/*
  # [Function] get_similar_jobs
  [Fetches jobs that are similar to a given job, based on industry and city.]

  ## Query Description: [This function helps users discover more opportunities by finding jobs in the same field and location as the one they are viewing. It does not modify any data.]
  
  ## Metadata:
  - Schema-Category: ["Safe"]
  - Impact-Level: ["Low"]
  - Requires-Backup: [false]
  - Reversible: [true]
  
  ## Structure Details:
  - Function: public.get_similar_jobs(job_id_param UUID, limit_count INT)
  
  ## Security Implications:
  - RLS Status: [N/A]
  - Policy Changes: [No]
  - Auth Requirements: [None]
  
  ## Performance Impact:
  - Indexes: [Relies on existing indexes on job_postings(industry_id, city_id)]
  - Triggers: [None]
  - Estimated Impact: [Low, performs a read-only query.]
*/
create or replace function get_similar_jobs(job_id_param uuid, limit_count int)
returns setof job_postings
language plpgsql
as $$
declare
    target_industry_id uuid;
    target_city_id uuid;
begin
    select industry_id, city_id
    into target_industry_id, target_city_id
    from public.job_postings
    where id = job_id_param;

    return query
    select *
    from public.job_postings
    where
        id != job_id_param and
        status = 'published' and
        (industry_id = target_industry_id or city_id = target_city_id)
    order by
        (case when industry_id = target_industry_id then 1 else 0 end) +
        (case when city_id = target_city_id then 1 else 0 end) desc,
        created_at desc
    limit limit_count;
end;
$$;

/*
  # [Function] search_companies
  [Performs a full-text search on company names and descriptions.]

  ## Query Description: [Allows users to search for companies in the company directory. This is a read-only operation.]
  
  ## Metadata:
  - Schema-Category: ["Safe"]
  - Impact-Level: ["Low"]
  - Requires-Backup: [false]
  - Reversible: [true]
  
  ## Structure Details:
  - Function: public.search_companies(keyword TEXT)
  
  ## Security Implications:
  - RLS Status: [N/A]
  - Policy Changes: [No]
  - Auth Requirements: [None]
  
  ## Performance Impact:
  - Indexes: [Would benefit from a GIN index on companies(name, description)]
  - Triggers: [None]
  - Estimated Impact: [Low to Medium, depending on table size.]
*/
create or replace function search_companies(keyword text)
returns setof companies
language sql
as $$
    select *
    from public.companies
    where
        name ilike '%' || keyword || '%' or
        description ilike '%' || keyword || '%';
$$;
