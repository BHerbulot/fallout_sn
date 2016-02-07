for (var i = 0; i < 22; i++){
    db.getCollection('posts').insert({
        user: "super",
        post: i,
        comments: [],
        date: new Date()
    });    
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    