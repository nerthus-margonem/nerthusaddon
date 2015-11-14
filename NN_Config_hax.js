function NN_config(){
$('#cfg_options div').slice(9,10).css('display','none');
if(hero.opt & 512){hero.opt = hero.opt & ~512; _g("config&opt=" + hero.opt2);}
}
g.loadQueue.push({fun:NN_config,data:""});