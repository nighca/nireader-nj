define(function(require, exports, module) {
    function Task(name, exec, duration){
        var self = this;
        
        self.name = name;
        self.duration = duration;
        self.repeat = typeof self.duration === 'number';

        self.exec = function(){
            try{
                exec.call(self, self);
            }catch(e){
                LOG(e);
            }
        };
    }

    Task.prototype.run = function(){
        if(!this.timer){
            this.exec();
            if(this.repeat){
                this.timer = setInterval(this.exec, this.duration);
            }
        }

        return this;
    };

    Task.prototype.stop = function(){
        this.timer = this.timer && clearInterval(this.timer);
        return this;
    };

    Task.list = [];

    Task.add = function(name, exec, duration){
        var task;
        if(name.constructor && name.constructor === Task){
            task = name;
        }else{
            task = new Task(name, exec, duration);
        }
        this.list.push(task);

        return this;
    };

    Task.runFrom = function(i, duration){
        i = typeof i === 'number' ? i : 0;
        duration = typeof duration === 'number' ? duration : 0;

        if(i >= this.list.length){
            return this;
        }

        try{
            this.list[i].run();
        }catch(e){
            LOG(e);
        }

        var self = this;
        setTimeout(function(){
            self.runFrom(++i, duration);
        }, duration);

        return this;
    };

    Task.run = Task.runFrom;

    Task.stop = function(){
        for(var i = 0, l = this.list.length; i < l; i++){
            this.list[i].stop();
        }

        return this;
    };

    module.exports = Task;
});
