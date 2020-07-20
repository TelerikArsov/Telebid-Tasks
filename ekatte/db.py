from dotenv import load_dotenv
load_dotenv("variables.env")

import psycopg2
import os

import pandas as pd
dfs = pd.read_excel('/home/telerik/Downloads/Ekatte/Ekatte_xlsx/Ek_obl.xlsx', usecols=['oblast', 'name', 'region'])
area = '/home/telerik/Downloads/Ekatte/Ekatte_xlsx/Ek_obl.xlsx'
sett = '/home/telerik/Downloads/Ekatte/Ekatte_xlsx/Ek_atte.xlsx'
muni = '/home/telerik/Downloads/Ekatte/Ekatte_xlsx/Ek_obst.xlsx'
def get_connection():
    connection = psycopg2.connect(user = os.environ.get("db-username"),
                                  password = os.environ.get("db-password"),
                                  host = os.environ.get("db-host"),
                                  port = os.environ.get("db-port"),
                                  database = os.environ.get("db"))
    return connection 

def close_connection(connection):
    if connection:
        connection.close()
        print("Postgres connection is closed")

def create_area(connection, area_path):
    cols = ['oblast', 'name','region']
    df = pd.read_excel(area_path, usecols=cols)
    cursor = connection.cursor()
    postgres_insert_query = """ INSERT INTO areas (ID, NAME, REGION) VALUES (%s,%s,%s)"""
    for _, row in df.iterrows():
        try:
            if not record_exists(cursor, 'areas', row[cols[0]]):
                cursor.execute(postgres_insert_query, (row[cols[0]], row[cols[1]], row[cols[2]]))
        except (Exception, psycopg2.Error) as error :
            print("Error while inserting into area", error)
    
    connection.commit()
    cursor.close()

def record_exists(cursor, table_name, id_value):
    from psycopg2.extensions import AsIs
    check_id_exists_query = """ SELECT id FROM %s WHERE id = %s """
    cursor.execute(check_id_exists_query, (AsIs(table_name), id_value))
    return cursor.fetchone() is not None

def create_muni_sett(connection, muni_path, sett_path):
    muni_cols = ['obstina', 'name']
    muni_df = pd.read_excel(muni_path, usecols=muni_cols)
    muni_insert_query = """ INSERT INTO municipalities (ID, NAME, AREA_ID) VALUES (%s, %s, %s) """
    sett_cols = ['ekatte', 'name', 't_v_m', 'oblast', 'obstina']
    sett_df = pd.read_excel(sett_path, usecols=sett_cols)
    sett_insert_query = """ INSERT INTO settlements (ID, NAME, T_V_M, MUNI_ID) VALUES (%s, %s, %s, %s) """


    cursor = connection.cursor()
    skip_first = True
    for _, sett_row in sett_df.iterrows():
        if skip_first:
            skip_first = False
            continue
        try:
            if not record_exists(cursor, 'municipalities', sett_row[sett_cols[4]]):
                muni = muni_df.loc[muni_df[muni_cols[0]] == sett_row[sett_cols[4]]]
                cursor.execute(muni_insert_query, (muni.iloc[0][muni_cols[0]], muni.iloc[0][muni_cols[1]],  sett_row[sett_cols[3]]))
            #else:
            #    print("ignored entry. Already exists")
            if not record_exists(cursor, 'settlements', sett_row[sett_cols[0]]):
                cursor.execute(sett_insert_query, (sett_row[sett_cols[0]], sett_row[sett_cols[1]], sett_row[sett_cols[2]], sett_row[sett_cols[4]]))
            #else:
            #    print("Ignored settlement. Already exists")
            connection.commit()
        except (Exception, psycopg2.Error) as error:
            print("Error while inserting settlements", error)
            connection.rollback()
    cursor.close()


def find_sett_info(sett_name):
    result = []
    try:
        connection = get_connection()
        cursor = connection.cursor()
        findquery = """ SELECT * FROM settlements WHERE name LIKE %(like)s """
        cursor.execute(findquery, dict(like= '%'+sett_name+'%'))
        sett_infos = cursor.fetchall()
        area_info = None
        muni_info = None
        for sett_info in sett_infos:
            if sett_info is not None:
                cursor.execute(""" SELECT * FROM municipalities WHERE id = %s""", (sett_info[3],))
                muni_info = cursor.fetchone()
            if muni_info is not None:
                cursor.execute(""" SELECT * FROM areas WHERE id = %s""", (muni_info[2],))
                area_info = cursor.fetchone()
            result.append({'sett_info': sett_info, 'muni_info': muni_info, 'area_info': area_info})
    except (Exception, psycopg2.Error) as error :
        print ("Error while connecting to PostgreSQL", error)
    finally:
        #closing database connection.
        cursor.close()
        close_connection(connection)
    return result

def insert_data(area_path=area, muni_path=muni, sett_path=sett):
    try:
        connection = get_connection()
        create_area(connection, area_path)
        create_muni_sett(connection, muni_path, sett_path)
    except (Exception, psycopg2.Error) as error :
        print ("Error while connecting to PostgreSQL", error)
    finally:
        #closing database connection.
        close_connection(connection)

if __name__ == "__main__":
    #insert_data()
    print(find_sett_info("Абл"))