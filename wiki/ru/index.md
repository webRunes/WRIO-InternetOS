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
Id int(11) AI PK, Guidvarchar(36), Added datetime, Title varchar(128), AuthorGuidvarchar(36), AuthorNamevarchar(128), Description varchar(512), PostContentvarchar(1024), Rating  decimal(12,2), Gs decimal(12.8), Followersint(11), Joiners, int(11), Picture varchar(128), PostTypevarchar(45), PostNamevarchar(45), TwitterCommentvarchar(256), AuthorPostNamevarchar(128), AuthorPostAccountvarchar(128), URL varchar(1024), AuthorPostContactTypevarchar(45), AuthorPostContactvarchar(128), Invite  bit(1), Lang varchar(45)

####core_PostHubs
Id int(11) AI P, PostIdint(11), Tag varchar(45)

####"core_Apps"
Id int(11) AI PK, Added datetime, Guidvarchar(36), AppTypevarchar(45), Title varchar(128), Tag varchar(45), Description varchar(512), Rating  decimal(12,2), Gs decimal(12,2), OwnerTypevarchar(45), OwnerTitlevarchar(128), Price varchar(45), Followers int(11), Joiners int(11), Picture varchar(256)

####core_UserApps
Id int(11) AI PK, Added datetime, UserGuidvarchar(36), AppIdint(11), AppTypevarchar(45), AppTagvarchar(128), AppTitlevarchar(128)

####core_UserAppItems
Id int(11) AI PK, UserAppIdint(11), PostIdint(11), PostGuidvarchar(36), PostTitlevarchar(128)

####core_Composes
Id int(11) AI PK, Guidvarchar(36), URL varchar(1024), Title varchar(128), Description varchar(512), Picture varchar(128), HubTagvarchar(45), AuthorGuidvarchar(36), AuthorNamevarchar(128), PostTypevarchar(45), PostNamevarchar(45), PostContentvarchar(1024), AuthorPostNamevarchar(128), AuthorPostAccountvarchar(128), AuthorPostContactTypevarchar(128), AuthorPostContactvarchar(256), Invite  bit(1), Lang varchar(45)

####TwitterTokens
Id int(11) AI PK, UserGuidvarchar(36), OauthTokenvarchar(128), OauthTokenSecretvarchar(128), UserIdvarchar(45), UserNamevarchar(128)

####core_WrioLanguages
Id int(11) AI PK, Language varchar(45), Title varchar(45), Name varchar(45)

####core_UserParams
Id int(11) AI PK, UserGuidvarchar(36), UsedLangsvarchar(1024)

or for Python 3+

##IIS
1.	cоздаем новую папку
2.	копируем файлы полученные с репозитория
3.	конфигурируем IIS
4.	в web.config приложения находим конфигурацию строки подключения к БД

```bash
    <add name="MySqlWrioCore" connectionString="Data Source=xx.xx.xx.xx; Port=3306; Database=db_name; uid=xxxxxx; pwd=xxxxxxxxxxx;" providerName="MySql.Data.MySqlClient" />
```


изменяем нужные параметры.


