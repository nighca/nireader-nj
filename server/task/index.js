var tasks = {
	'Fetch feed': require('./fetchFeed')
};

for(var name in tasks){
	console.log('Run task ' + name + '...');
	tasks[name].run();
}