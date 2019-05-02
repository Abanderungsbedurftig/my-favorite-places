const Location = require('../models/location').Location;
const config = require('../config')

module.exports.getPoints = async (ctx, next) => {
    const point = {
        type: 'Point',
        coordinates: [parseFloat(ctx.query.lng), parseFloat(ctx.query.lat)]
    };
    const maxDistance = config.get('distance');
    try{
        let locations = await Location.find({
            coords: {
                $near: {
                    $geometry: point,
                    $maxDistance: maxDistance
                }
            }
        });
        let points = await locations.map(loc => ({
            id: loc._id,
            name: loc.name,
            lng: loc.coords[0],
            lat: loc.coords[1],
            description: loc.description,
            rating: loc.rating,
        }));
        ctx.status = 200;
        ctx.body = JSON.stringify(points);
    }catch(err){
        next(err);
    }
}

module.exports.addPoint = async (ctx, next) => {
        let body = JSON.stringify(ctx.request.body);
        body = JSON.parse(body);
        try{
            if(body.name && body.lng && body.lat){
                let loc = new Location({
                    name: body.name,
                    address: body.address || '',
                    rating: parseInt(body.rating),
                    description: body.description || '',
                    coords: [parseFloat(body.lng), parseFloat(body.lat)]
                });
                loc.save();
                const location = {
                    id: loc._id,
                    name: body.name,
                    lng: body.lng,
                    lat: body.lat,
                    rating: body.rating,
                    description: body.description               
                };
                ctx.status = 200;
                ctx.body = JSON.stringify({location});
            }else throw new Error('Получены не все данные');
        }catch(err){
            next(err);
        }
}

module.exports.deletePoint = async (ctx, next) => {
    let body = JSON.stringify(ctx.request.body);
    body = JSON.parse(body);
    try{
        if(body.id){
            let query = await Location.findOneAndDelete({_id: body.id});
            if(query){
                ctx.status = 200;
                ctx.body = JSON.stringify({});
            }else throw new Error('Ошибка при удалении');
        }else throw new Error('Получены не все данные');
    }catch(err){
        next(err);
    }
}

