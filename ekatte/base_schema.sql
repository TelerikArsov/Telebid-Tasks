create table settlements (
    ekatte_id INTEGER PRIMARY KEY,                         --Unique id of settlement
    name VARCHAR(25) NOT NULL,                             --Name of settlement
    t_v_m VARCHAR(4) NOT NULL,                             --Prefix of name
    area_code VARCHAR(3) REFERENCES areas(code),           --Area to which the settlement belongs
    muni_code VARCHAR(5) REFERENCES municipalities(code)   --Municipality to which the settlement belongs
);

create table areas (
    code VARCHAR(3) PRIMARY KEY,                                --Unique code of area
    name VARCHAR(25) NOT NULL,                                  --Name of area
    main_ekatte_id INTEGER REFERENCES settlements(ekatte_id),   --Id of settlement in the center of the area
    region VARCHAR(4) NOT NULL                                  --Region of level 2 to which the area belong                                   
);

create table municipalities (
    code VARCHAR(3) PRIMARY KEY,                                --Unique code of municipality                
    name VARCHAR(25) NOT NULL,                                  --Name of municipality
    main_ekatte_id INTEGER REFERENCES settlements(ekatte_id),   ----Id of settlement in the center of the munic.
);