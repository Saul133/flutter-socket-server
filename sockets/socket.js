const {io} = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');
const bands = new Bands();
bands.addBand( new Band('Queen'));
bands.addBand( new Band('Imagine Dragons'));
bands.addBand( new Band('Fall out boys'));
bands.addBand( new Band('Rammstein'));
console.log(bands);
//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente Conectado');
    client.emit('bandas-activas', bands.getBands());
    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
    });

    client.on('mensaje',(payload)=> {
        console.log('Mensaje',payload);
        io.emit('mensaje',{admin: 'Nuevo mensaje'});
    });
    client.on('vote-band', (payload)=> {
        bands.voteBand(payload.id);
        io.emit('bandas-activas', bands.getBands());
    })
    client.on('add-band', (payload)=> {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('bandas-activas', bands.getBands());
    })
    client.on('delete-band', (payload)=> {
        bands.deleteBand(payload.id);
        io.emit('bandas-activas', bands.getBands());
    })

   
    // client.on('emitir-mensaje', (payload)=> {
    //     // console.log(payload);
    //     // io.emit('nuevo-mensaje',payload); Emite a todos
    //     client.broadcast.emit('nuevo-mensaje',payload);
    // })

});
