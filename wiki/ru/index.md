#Содержание

1. [О проекте](http://wrio.webrunes.com/wiki/ru/hash)
2. [Требования](http://wrio.webrunes.com/wiki/ru/hash)
3. [MySQL](http://wrio.webrunes.com/wiki/ru/hash)
3. [IIS](http://wrio.webrunes.com/wiki/ru/hash)
4. [Приложение](http://wrio.webrunes.com/wiki/ru/hash)

##О проекте
(пусто)

##Требования
1.	IIS 7.0 или выше, с установленным .NET 4.5 и ASP.NETMVC4
2.	База данных MySQL
3.	Работа приложения

##БД MySQL
1.	создаем новую базу данных с кодировкой charsetUTF8
2.	оздаем пользователя для работы с БД
3.	конфигурируем MySQL для доступа с нужного нам IP-адресса
Все параметры: наименование БД, пользователь и его пароль, IP сервера MySQL сохраняем для настройки конфигурационного файла приложения.

###Таблицы MySQL
####core_Posts
```bash
Id int(11) AI PK
Guidvarchar(36)
Added datetime
Title varchar(128)
AuthorGuidvarchar(36)
AuthorNamevarchar(128)
Description varchar(512)
PostContentvarchar(1024)
Rating  decimal(12,2)
Gs decimal(12.8)
Followersint(11)
Joiners int(11)
Picture varchar(128)
PostTypevarchar(45)
PostNamevarchar(45)
TwitterCommentvarchar(256)
AuthorPostNamevarchar(128)
AuthorPostAccountvarchar(128)
URL varchar(1024)
AuthorPostContactTypevarchar(45)
AuthorPostContactvarchar(128)
Invite  bit(1)
Lang varchar(45)
```

####core_PostHubs
```bash
Id int(11) AI P
PostIdint(11)
Tag varchar(45)
```

####core_Apps
```bash
Id int(11) AI PK
Added datetime
Guidvarchar(36)
AppTypevarchar(45)
Title varchar(128)
Tag varchar(45)
Description varchar(512)
Rating  decimal(12,2)
Gs decimal(12,2)
OwnerTypevarchar(45)
OwnerTitlevarchar(128)
Price varchar(45)
Followers int(11)
Joiners int(11)
Picture varchar(256)
```

####core_UserApps
```bash
Id int(11) AI PK
Added datetime
UserGuidvarchar(36)
AppIdint(11)
AppTypevarchar(45)
AppTagvarchar(128)
AppTitlevarchar(128)
```

####core_UserAppItems
```bash
Id int(11) AI PK
UserAppIdint(11)
PostIdint(11)
PostGuidvarchar(36)
PostTitlevarchar(128)
```

####core_Composes
```bash
Id int(11) AI PK
Guidvarchar(36)
URL varchar(1024)
Title varchar(128)
Description varchar(512)
Picture varchar(128)
HubTagvarchar(45)
AuthorGuidvarchar(36)
AuthorNamevarchar(128)
PostTypevarchar(45)
PostNamevarchar(45)
PostContentvarchar(1024)
AuthorPostNamevarchar(128)
AuthorPostAccountvarchar(128)
AuthorPostContactTypevarchar(128)
AuthorPostContactvarchar(256)
Invite  bit(1)
Lang varchar(45)
```

####TwitterTokens
```bash
Id int(11) AI PK
UserGuidvarchar(36)
OauthTokenvarchar(128)
OauthTokenSecretvarchar(128)
UserIdvarchar(45)
UserNamevarchar(128)
```

####core_WrioLanguages
```bash
Id int(11) AI PK
Language varchar(45)
Title varchar(45)
Name varchar(45)
```

####core_UserParams
```bash
Id int(11) AI PK
UserGuidvarchar(36)
UsedLangsvarchar(1024)
```

##IIS
1.	cоздаем новую папку
2.	копируем файлы полученные с репозитория
3.	конфигурируем IIS
4.	в web.config приложения находим конфигурацию строки подключения к БД
```bash
<add name="MySqlWrioCore" connectionString="Data Source=xx.xx.xx.xx; Port=xxxx; Database=db_name; uid=xxxxxx; pwd=xxxxxxxxxxx;" providerName="MySql.Data.MySqlClient" />
```
изменяем нужные параметры.

##Приложение 1.
Для заполнения таблицы "core_WrioLanguages" берем данные ниже:<br/>
Language - соответствует ID<br/>
Title - соответствует title<br/>
Name - соответствует значению<br/>
```bash
id="so_SO" title="Somali">Af-Soomaali<
id="af_ZA" title="Afrikaans">Afrikaans<
id="ay_BO" title="Aymara">Aymararu<
id="az_AZ" title="Azerbaijani">Azərbaycandili<
id="id_ID" title="Indonesian">Bahasa Indonesia<
id="ms_MY" title="Malay">Bahasa Melayu<
id="jv_ID" title="Javanese">BasaJawa<
id="cx_PH" title="Cebuano">Bisaya<
id="bs_BA" title="Bosnian">Bosanski<
id="ca_ES" title="Catalan">Català<
id="cs_CZ" title="Czech">Čeština<
id="ck_US" title="Cherokee">Cherokee<
id="cy_GB" title="Welsh">Cymraeg<
id="da_DK" title="Danish">Dansk<
id="se_NO" title="Northern Sámi">Davvisámegiella<
id="de_DE" title="German">Deutsch<
id="et_EE" title="Estonian">Eesti<
id="en_IN" title="English (India)">English (India)<
id="en_GB" title="English (UK)">English (UK)<
id="en_US" title="English (US)">English (US)<
id="es_LA" title="Spanish">Español<
id="es_CL" title="Spanish (Chile)">Español (Chile)<
id="es_CO" title="Spanish (Colombia)">Español (Colombia)<
id="es_ES" title="Spanish (Spain)">Español (España)<
id="es_MX" title="Spanish (Mexico)">Español (México)<
id="es_VE" title="Spanish (Venezuela)">Español (Venezuela)<
id="eo_EO" title="Esperanto">Esperanto<
id="eu_ES" title="Basque">Euskara<
id="tl_PH" title="Filipino">Filipino<
id="fo_FO" title="Faroese">Føroyskt<
id="fr_CA" title="French (Canada)">Français (Canada)<
id="fr_FR" title="French (France)">Français (France)<
id="fy_NL" title="Frisian">Frysk<
id="ga_IE" title="Irish">Gaeilge<
id="gl_ES" title="Galician">Galego<
id="gn_PY" title="Guarani">Guarani<
id="hr_HR" title="Croatian">Hrvatski<
id="xh_ZA" title="Xhosa">isiXhosa<
id="zu_ZA" title="Zulu">isiZulu<
id="is_IS" title="Icelandic">Íslenska<
id="it_IT" title="Italian">Italiano<
id="sw_KE" title="Swahili">Kiswahili<
id="ku_TR" title="Kurdish">Kurdî<
id="lv_LV" title="Latvian">Latviešu<
id="lt_LT" title="Lithuanian">Lietuvių<
id="li_NL" title="Limburgish">Limburgs<
id="la_VA" title="Latin">lingua latina<
id="hu_HU" title="Hungarian">Magyar<
id="mg_MG" title="Malagasy">Malagasy<
id="mt_MT" title="Maltese">Malti<
id="nl_NL" title="Dutch">Nederlands<
id="nl_BE" title="Dutch (België)">Nederlands (België)<
id="nb_NO" title="Norwegian (bokmal)">Norsk (bokmål)<
id="nn_NO" title="Norwegian (nynorsk)">Norsk (nynorsk)<
id="uz_UZ" title="Uzbek">O'zbek<
id="pl_PL" title="Polish">Polski<
id="pt_BR" title="Portuguese (Brazil)">Português (Brasil)<
id="pt_PT" title="Portuguese (Portugal)">Português (Portugal)<
id="qu_PE" title="Quechua">Qhichwa<
id="ro_RO" title="Romanian">Română<
id="rm_CH" title="Romansh">Rumantsch<
id="sq_AL" title="Albanian">Shqip<
id="sk_SK" title="Slovak">Slovenčina<
id="sl_SI" title="Slovenian">Slovenščina<
id="fi_FI" title="Finnish">Suomi<
id="sv_SE" title="Swedish">Svenska<
id="vi_VN" title="Vietnamese">TiếngViệt<
id="tr_TR" title="Turkish">Türkçe<
id="el_GR" title="Greek">Ελληνικά<
id="gx_GR" title="Classical Greek">Ἑλληνικήἀρχαία<
id="be_BY" title="Belarusian">Беларуская<
id="bg_BG" title="Bulgarian">Български<
id="kk_KZ" title="Kazakh">Қазақша<
id="mk_MK" title="Macedonian">Македонски<
id="mn_MN" title="Mongolian">Монгол<
id="ru_RU" title="Russian">Русский<
id="sr_RS" title="Serbian">Српски<
id="tt_RU" title="Tatar">Татарча<
id="tg_TJ" title="Tajik">тоҷикӣ<
id="uk_UA" title="Ukrainian">Українська<
id="ka_GE" title="Georgian">ქართული<
id="hy_AM" title="Armenian">Հայերեն<
id="yi_DE" title="Yiddish">ייִדיש<
id="he_IL" title="Hebrew">עברית<
id="ur_PK" title="Urdu">اردو<
id="ar_AR" title="Arabic">العربية<
id="ps_AF" title="Pashto">پښتو<
id="fa_IR" title="Persian">فارسی<
id="sy_SY" title="Syriac">ܐܪܡܝܐ<
id="ne_NP" title="Nepali">नेपाली<
id="mr_IN" title="Marathi">मराठी<
id="sa_IN" title="Sanskrit">संस्कृतम्<
id="hi_IN" title="Hindi">हिन्दी<
id="bn_IN" title="Bengali">বাংলা<
id="pa_IN" title="Punjabi">ਪੰਜਾਬੀ<
id="gu_IN" title="Gujarati">ગુજરાતી<
id="or_IN" title="Oriya">ଓଡ଼ିଆ<
id="ta_IN" title="Tamil">தமிழ்<
id="te_IN" title="Telugu">తెలుగు<
id="kn_IN" title="Kannada">ಕನ್ನಡ<
id="ml_IN" title="Malayalam">മലയാളം<
id="si_LK" title="Sinhala">සිංහල<
id="th_TH" title="Thai">ภาษาไทย<
id="my_MM" title="Burmese">မြန်မာဘာသာ<
id="km_KH" title="Khmer">ភាសាខ្មែរ<
id="ko_KR" title="Korean">한국어<
id="zh_TW" title="Traditional Chinese (Taiwan)">中文(台灣)<
id="zh_CN" title="Simplified Chinese (China)">中文(简体)<
id="zh_HK" title="Traditional Chinese (Hong Kong)">中文(香港)<
id="ja_JP" title="Japanese">日本語<
```
