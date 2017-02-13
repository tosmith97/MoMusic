import config
import time
import atexit

import requests
import urllib

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

#test
import logging

import os
from flask import Flask, request, session, g, redirect, flash

from twilio.rest import TwilioRestClient
import spotipy
import spotipy.util as util

app = Flask(__name__)
app.config.from_object(__name__)


# Functions
def send_sms(client, msg):
    message = client.messages.create(body=msg,
        to=config.MY_NUMBER,
        from_=config.TWILIO_NUMBER)


def find_fav_artists(sp, fav_artists):  
    ranges = ['short_term', 'medium_term']

    for range in ranges:
        results = sp.current_user_top_tracks(time_range=range, limit=20)
        for i, item in enumerate(results['items']):
            fav_artists.add(item['artists'][0]['name'])
    

def get_new_songs(): #sp, fav_artists, seen_songs):
    new_songs = sp.new_releases()
    
    for i, artist in enumerate(fav_artists):
        print i, artist
        payload = {'tag': 'new', 'type': 'track', 'limit':'3'}
        query = "https://api.spotify.com/v1/search?q=" + artist
        r = requests.get(query, params=payload)
        data = r.json()            

    dope = []
    for s in new_songs['albums']['items']:
        artist = s['artists'][0]['name']
        song_title = s['name']
        if artist in fav_artists and song_title not in seen_songs:
            url = s['external_urls']['spotify']
            dope.append((artist, song_title, url))
            seen_songs.add(song_title)  
    # for d in dope:
    #     text = d[0] + ' just released a new song: ' + d[1] + '\nCheck it out at ' + d[2]
    #     send_sms(client, text)


@app.route('/')
def hello():
    return "hello"


# Setup
@app.before_first_request
def initialize():
    scheduler = BackgroundScheduler()
    scheduler.start()
    scheduler.add_job(
        func=get_new_songs,
        trigger=IntervalTrigger(seconds=2),
        id='momusic',
        name='momusic',
        replace_existing=True
    )
    # shut down when exit app
    atexit.register(lambda: scheduler.shutdown())

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))


    # Twilio info
    account_sid = config.TWILIO_ACCOUNT_SID
    auth_token = config.TWILIO_AUTH_TOKEN
    client = TwilioRestClient(account_sid, auth_token)

    # Spotify info
    scopes = "user-library-read user-top-read"
    token = util.prompt_for_user_token(config.SPOTIFY_USERNAME, scopes,
                        client_id=config.CLIENT_ID, 
                        client_secret=config.CLIENT_SECRET, 
                        redirect_uri='http://localhost:8888/callback')

    sp = spotipy.Spotify(auth=token)
    fav_artists = {"Drake", "R3hab"}
    find_fav_artists(sp, fav_artists)
    print fav_artists
    seen_songs = set()

    app.run(host='0.0.0.0', port=port)

