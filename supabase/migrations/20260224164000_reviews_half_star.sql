-- Allow half-star ratings on reviews
alter table public.reviews
  alter column rating drop default,
  alter column rating type numeric(2,1) using rating::numeric;

-- drop old check if exists (name may vary), then add new constraint
do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.reviews'::regclass
      and contype = 'c'
      and conname ilike '%rating%'
  ) then
    execute (
      select 'alter table public.reviews drop constraint ' || quote_ident(conname)
      from pg_constraint
      where conrelid = 'public.reviews'::regclass
        and contype = 'c'
        and conname ilike '%rating%'
      limit 1
    );
  end if;
end$$;

alter table public.reviews
  add constraint reviews_rating_check
  check (
    rating between 1 and 5
    and (rating * 2) = floor(rating * 2)
  );

alter table public.reviews alter column rating set default 5;
