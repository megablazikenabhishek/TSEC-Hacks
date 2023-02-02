const mongoose = require('mongoose');
try {
    (async ()=>{
        await mongoose.connect('mongodb+srv://Abhii:123@tsec-hacks-23.0qambkg.mongodb.net/test1?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
        
    })();
}catch(err){
    console.log(err);
}


module.exports = mongoose;