create table if not exists ratings(tconst varchar, average_rating numeric(2), votes integer);
create table if not exists titles(tconst varchar, title_type varchar, primary_title varchar, original_title varchar, is_adult boolean, start_year varchar, end_year varchar, runtime_minutes varchar, genres varchar);
	