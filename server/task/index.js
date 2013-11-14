var tasks = {
    'Fetch feed': require('./fetchFeed'),
    'Clean old items': require('./cleanItem')
};

for(var t in tasks){
    console.log('Run task ' + t + '...');
    tasks[t].run();
}