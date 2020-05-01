import pymongo
import json
import pandas as pd
import datetime
from pymongo import MongoClient
from pprint import pprint
import re
from _datetime import date

# connection configurations
host_address = "@ec2-35-171-182-112.compute-1.amazonaws.com"
user_name = "satya"
password = "satya123"
    
# function that converts the date in date time formatter
def dateTimeConverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()
    
# mongo db connection
mongodb_connection = pymongo.MongoClient("mongodb://" + user_name + ':' + password + host_address + ":27017/cloud")
database = mongodb_connection.cloud    

def insertData(books_data):
    book_collection = database['books']
    book_collection.insert_many(books_data)
        
def insertLogs(logs):
    log_collections = database['logs'] 
    log_collections.insert_many(logs) 

def extractData():
    for year in range(1996, 2020):
        books_data = []
        ip_file = 'GUTINDEX.'+ str(year) + '.txt'
        start_time_now = datetime.datetime.now()
        
        # opening each text file
        with open(ip_file, 'r', encoding = 'utf-8', errors="ignore") as fileName:
            ip_data = fileName.read().replace(u'\xa0', u' ')
            # finding the reference of the title and author name
            if 'EBOOK NO.' in ip_data:
                title_reference = ip_data[ip_data.index('EBOOK NO.') + len('EBOOK NO.'):]
            elif 'ETEXT NO.' in ip_data:
                title_reference = ip_data[ip_data.index('ETEXT NO.') + len('ETEXT NO.'):]
            
            title_reference = re.sub(r"\[.\s.\]\s","", title_reference)
            title_reference = re.sub(r"\[.\s.\s.\]?\s","", title_reference)
                
            book_content = [bookContent.strip().replace(u'\xa0', u' ').replace(u'\u00eb', u' ').split('   ')[0].split(', by') for bookContent in title_reference.split('\n') if ", by" in bookContent]
            
            for book in book_content: 
                books_data.append({
                    'Title': book[0],
                    'Author': book[1]
                })      
                
            insertData(books_data)
    
        end_time_now = datetime.datetime.now()
        logs.append({
            'DocumentName': ip_file,
            'StartTime': start_time_now,
            'EndTime': end_time_now
        })
            

logs = []
extractData()
insertLogs(logs)
mongodb_connection.close()
