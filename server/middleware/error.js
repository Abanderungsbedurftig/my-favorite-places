
module.exports = async (ctx, next) => {
    try{
        await next();
    }catch(err){
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = JSON.stringify({message: err.message});
    }
}