
var util = require('../lib/index');




var examp_twet = {
      "created_at": "Sat Jun 18 23:44:46 +0000 2016",
      "id": 744314946696130600,
      "id_str": "744314946696130560",
      "text": "foo varsa bar da vardır asfmskdsdfdlksfl haha",
      "truncated": false,
      "entities":  {
        "hashtags":  [],
        "symbols":  [],
        "user_mentions":  [
           {
            "screen_name": "Zak_Bagans",
            "name": "Zak Bagans",
            "id": 62760327,
            "id_str": "62760327",
            "indices":  [
              0,
              11
            ]
          }
        ],
        "urls":  []
      },
      "metadata":  {
        "iso_language_code": "en",
        "result_type": "recent"
      },
      "source": `<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>`,
      "in_reply_to_status_id": null,
      "in_reply_to_status_id_str": null,
      "in_reply_to_user_id": 62760327,
      "in_reply_to_user_id_str": "62760327",
      "in_reply_to_screen_name": "Zak_Bagans",
      "user":  {
        "id": 3051687581,
        "id_str": "3051687581",
        "name": "Taylor Hickey",
        "screen_name": "TaylorHickey22",
        "location": "Spaceship Enterprise ",
        "description": "Tis I, the frenchiest fry",
        "url": null,
        "entities":  {
          "description":  {
            "urls":  []
          }
        },
        "protected": false,
        "followers_count": 300,
        "friends_count": 359,
        "listed_count": 5,
        "created_at": "Sun Feb 22 03:38:06 +0000 2015",
        "favourites_count": 29593,
        "utc_offset": -25200,
        "time_zone": "Pacific Time (US & Canada)",
        "geo_enabled": true,
        "verified": false,
        "statuses_count": 8396,
        "lang": "en",
        "contributors_enabled": false,
        "is_translator": false,
        "is_translation_enabled": false,
        "profile_background_color": "C0DEED",
        "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_tile": false,
        "profile_image_url": "http://pbs.twimg.com/profile_images/734930676693258240/fcNE4bs0_normal.jpg",
        "profile_image_url_https": "https://pbs.twimg.com/profile_images/734930676693258240/fcNE4bs0_normal.jpg",
        "profile_banner_url": "https://pbs.twimg.com/profile_banners/3051687581/1464365917",
        "profile_link_color": "0084B4",
        "profile_sidebar_border_color": "C0DEED",
        "profile_sidebar_fill_color": "DDEEF6",
        "profile_text_color": "333333",
        "profile_use_background_image": true,
        "has_extended_profile": true,
        "default_profile": true,
        "default_profile_image": false,
        "following": false,
        "follow_request_sent": false,
        "notifications": false
      },
      "geo": null,
      "coordinates": null,
      "place":  {
        "id": "0da8a6c990f02eed",
        "url": "https://api.twitter.com/1.1/geo/id/0da8a6c990f02eed.json",
        "place_type": "city",
        "name": "Orland Park",
        "full_name": "Orland Park, IL",
        "country_code": "US",
        "country": "United States",
        "contained_within":  [],
        "bounding_box":  {
          "type": "Polygon",
          "coordinates":  [
             [
               [
                -87.911936,
                41.552464
              ],
               [
                -87.790471,
                41.552464
              ],
               [
                -87.790471,
                41.65669
              ],
               [
                -87.911936,
                41.65669
              ]
            ]
          ]
        },
        "attributes":  {}
      },
      "contributors": null,
      "is_quote_status": false,
      "retweet_count": 0,
      "favorite_count": 0,
      "favorited": false,
      "retweeted": false,
      "lang": "en"
    };







function hey() {
	return function(twet){
		return true;
	}
};

function hoy() {
	return function(twet){
		if(twet.text.includes('haha')){ // haha varsa twet blacklistden geçemez
			return false
		}
		return true
	}
};
function bar() {
	return function(twet){
		return true
	}
};

//console.log(util.control(examp_twet,[hey(),hoy()],bar()));

function mytwet(){
	return function(twet, args){
		console.log('bum');
	}

}

function mytwet2(){
	return function(twet, args){
		console.log('bum');
	}
}


function examp_blacklist() {
	return function(twet){
		if(twet.user.id == 3051687581){
			return false;
		}
		return true;
	}
}

function examp_blacklist2() {

	return function(twet){
		if(twet.user.screen_name == 'TaylorHickey22'){
			return false;
		}
		return true;
	}
}


//console.log([examp_blacklist(),examp_blacklist2()].map(function(func){
//	return func.call(this,examp_twet);
//}));

//util.action('hey',['--bar=true','--foo=false'],mytwet(),mytwet2(),[mytwet(),mytwet2()])
