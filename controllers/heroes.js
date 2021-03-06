const Heroes = require("../models/heroes")

const getHeroes = async (req, res) => {
    const heroes = await Heroes.find({});
    res.json([{
        ok: true,
        heroes
    }])
}

const getHeroe = async (req, res) => {
    let id = req.params.id;
    try {
        const heroe = await Heroes.findById(id);
        if (!heroe) {
            res.status(400).json({
                ok: false,
                msg: 'No existe un heroe con ese Id'
            })
        }
        res.status(200).json({
            ok: true,
            msg: 'Heroe Encontrado',
            heroe
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error comuniquese con el administrador',
        })
    }

}

const crearHeroes = async (req, res = response) => {
    const { nombre } = (req.body);

    function toTitleCase(str) {
        let title = str.toLowerCase().split(' ');
        for (var i = 0; i < title.length; i++) {
            title[i] = title[i].charAt(0).toUpperCase() + title[i].slice(1);
        }
        return title.join(' ');
    }
    let nombreMin = toTitleCase(nombre);

    try {

        const existeHeroe = await Heroes.findOne({ nombre: nombreMin });
        if (existeHeroe) {
            return res.status(400).json({
                ok: false,
                msg: 'El SuperHeroe ya esta registrado'
            })
        }
        req.body.nombre = nombreMin;

        const heroe = new Heroes(req.body);
        await heroe.save();
        res.json({
            ok: true,
            msg: 'El Super Heroe ha sido creado',
            heroe
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hable con el Administrador"
        })
    }

}

const actualizarHeroes = async (req, res = response) => {
    const id = req.params.id;
    try {
        const usuarioDb = await Heroes.findById(id);
        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un superheroe con ese Id'
            })
        }
        const { nombre } = (req.body);
        function toTitleCase(str) {
            let title = str.toLowerCase().split(' ');
            for (var i = 0; i < title.length; i++) {
                title[i] = title[i].charAt(0).toUpperCase() + title[i].slice(1);
            }
            return title.join(' ');
        }
        let nombreMin = toTitleCase(nombre);

        req.body.nombre = nombreMin;
        const campos = req.body;
        delete campos.grupo;
        delete campos.condicion;
        delete campos.poder;
        delete campos.img;

        const heroeActualizado = await Heroes.findByIdAndUpdate(id, campos, { new: true });
        res.json({
            ok: true,
            msg: 'El Super Heroe se ha actualizado',
            heroe: heroeActualizado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hable con el Administrador"
        })
    }

}
module.exports = { getHeroes, crearHeroes, actualizarHeroes, getHeroe }