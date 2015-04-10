var WinHTTP=function(a){return F.activex("MSXML2.ServerXMLHttp",function(b){this.open("GET",b,false);this.send();return this},a)};var MPIHost="mpi.thinkasp.cn",installDirectory=IO.build(Mo.Config.Global.MO_CORE,"Library/Extend");function _install(l,m,g){g=!!g;if(typeof l!="object"){Mpi.message="package error.";return false}if(!l.name||!/^([\w\.\-]+)$/ig.test(l.name)){Mpi.message="package name format error.";return false}var r=IO.build(m,l.name);if(!g&&IO.directory.exists(r)){Mpi.message="package is exists.";return false}if(!IO.directory.exists(r)){g=false}var f=Mpi.packageExists2("jszip")?"jszip":(Mpi.packageExists2("assets/tar")?"tar":"none");if(f=="none"){Mpi.message="can not find any method to unpack.";return false}var q,b,c;try{var j=IO.build(Mpi.PATH.CACHE,F.format("{0}@{1}.zip",l.name,l.version));if(f=="tar"){b=require("assets/tar");c=new b(j);IO.file.del(j)}else{b=require(f);q=IO.file.readAllBytes(j);IO.file.del(j);c=new b(base64.fromBinary(q),{base64:true})}}catch(k){Mpi.message=k.description;return false}if(g){IO.directory.clear(r)}var a=c.files,p=[];for(var h in a){if(!a.hasOwnProperty(h)){continue}var e=a[h];if(e.name.substr(0,1)=="."){Mpi.message="unsafe filename '"+e.name+"'.";while(p.length>0){var o=p.pop();if(o.substr(0,2)=="D~"){IO.directory.del(o.substr(2))}else{IO.file.del(o.substr(2))}}return false}var n=IO.build(r,e.name);if(e.dir){IO.directory.create(n);p.push("D~"+n)}else{var d=IO.parent(n);if(!IO.directory.exists(d)){IO.directory.create(d)}IO.file.writeAllBytes(n,f=="jszip"?base64.toBinary(base64.e(e._data.getContent())):e.data);p.push("F~"+n)}}return true}function _fetchJson(b){try{var a=WinHTTP(b);if(a.status==200){return JSON.parse(a.responseText)}else{if(a.status==500){Mpi.message="Server error. message from server:'"+a.responseText+"'."}else{Mpi.message="Can not load package.server error-"+a.status+"."}}}catch(c){Mpi.message=c.description}return null}function _saveBinary(b,d){try{var a=WinHTTP(b);if(a.status==200){IO.file.writeAllBytes(d,a.responseBody);return true}else{if(a.status==500){Mpi.message="Server error. message from server:'"+a.responseText+"'."}else{Mpi.message="Can not load package.server error-"+a.status+"."}}}catch(c){Mpi.message=c.description}return false}var Mpi={};Mpi.message="";Mpi.PATH={CORE:IO.build(Mo.Config.Global.MO_CORE,"Library/Extend"),APP:IO.build(Mo.Config.Global.MO_APP,"Library/Extend"),CACHE:IO.build(Mo.Config.Global.MO_APP,"Cache")};Mpi.Host=function(a){MPIHost=a};Mpi.setDefaultInstallDirectory=function(a){installDirectory=IO.build(a,"Library/Extend")};Mpi.download=function(a){var c=Mpi.packageExists2("jszip")?"":(Mpi.packageExists2("assets/tar")?"tar":"none");if(c=="none"){Mpi.message="can not find any method to unpack.";return false}var b="";if(c=="tar"){b="tar"}else{if(c=="xmlpkg"){b="xml"}}return _saveBinary(F.string.format("http://{0}/?/mpi/package/download/{1}/{2}",MPIHost,a.name,c),IO.build(Mpi.PATH.CACHE,F.format("{0}@{1}.zip",a.name,a.version)))};Mpi.fetchPackagesList=function(){return _fetchJson(F.string.format("http://{0}/?/mpi/package/list/fetch",MPIHost))};Mpi.fetchPackage=function(a){return _fetchJson(F.string.format("http://{0}/?/mpi/package/info/{1}/fetch",MPIHost,a))};Mpi.packageExists2=function(a){if(typeof a=="string"){a={name:a}}if(!a.name||!/^([\w\.\-]+)$/ig.test(a.name)){Mpi.message="package name format error.";return true}return IO.directory.exists(IO.build(Mpi.PATH.APP,a.name))||IO.directory.exists(IO.build(Mpi.PATH.CORE,a.name))||IO.file.exists(IO.build(Mpi.PATH.APP,a.name))||IO.file.exists(IO.build(Mpi.PATH.CORE,a.name))};Mpi.packageExists=function(c){Mpi.message="";if(typeof c=="string"){c={name:c,version:"1.0.0.0"}}if(!c.name||!/^([\w\.\-]+)$/ig.test(c.name)){Mpi.message="package name format error.";return null}var a=IO.build(installDirectory,c.name),b=IO.build(a,"package.json");if(IO.directory.exists(a)){if(IO.file.exists(b)){try{return JSON.parse(IO.file.readAllText(b))}catch(d){Mpi.message="package.json format error."}}else{Mpi.message="package.json is not exists."}}return null};Mpi.checkDependencies=function(a){if(!a){return false}if(a.dependencies){var b=a.dependencies;for(var c in b){if(!b.hasOwnProperty(c)){continue}if(!Mpi.packageExists(c)){Mpi.message="depended module '"+c+"' is not exists, please install it first.";return false}}}return true};Mpi.install=function(a,b){b=b||{};var c=b.dir||Mpi.PATH[b.path]||installDirectory;return _install(a,c,b.update)};Mpi.downloadAndInstall=function(c,b){var a=Mpi.fetchPackage(c);if(!Mpi.checkDependencies(a)){return false}if(!Mpi.download(a)){return false}return Mpi.install(a,b)};module.exports=Mpi;