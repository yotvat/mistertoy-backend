
import fs from 'fs'
import { utilService } from './util.service.js'
const toys = utilService.readJsonFile('data/toy.json')

export const toyService = {
    query,
    getById,
    save,
    remove
}

function query(filterBy, sortBy) {

    // console.log('filterBy', filterBy)
    // no need - 
    if (!filterBy && !sortBy) return Promise.resolve(toys)

    let toysToReturn = toys
    if (filterBy.txt) {

        const regExp = new RegExp(filterBy.txt, 'i')
        toysToReturn = toysToReturn.filter(toy => regExp.test(toy.name))
    }

    if (filterBy.maxPrice) {
        toysToReturn = toysToReturn.filter(toy => toy.price >= filterBy.maxPrice)
    }
    if (filterBy.inStock !== 'all') {
        toysToReturn = toysToReturn.filter(toy => toy.inStock.toString() === filterBy.inStock)
    }

    //sort
    if (sortBy.name) {
        toysToReturn = toysToReturn.sort((t1, t2) => (t1.name.localeCompare(t2.name)) * sortBy.name)
    }

    if (sortBy.price) {
        toysToReturn = toysToReturn.sort((t1, t2) => (t1.price - t2.price) * sortBy.price)
    }
    if (sortBy.created) {
        toysToReturn = toysToReturn.sort((t1, t2) => (t1.createdAt - t2.createdAt) * sortBy.created)
    }

    return Promise.resolve(toysToReturn);
}

function getById(_id) {
    const toy = toys.find(toy => toy._id === _id)
    //
    return Promise.resolve(toy);
}

function remove(_id) {
    const idx = toys.findIndex(toy => toy._id === _id)
    toys.splice(idx, 1);
    _saveToysToFile()
    return Promise.resolve();
}

function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(currToy => currToy._id === toy._id)
        toys[idx] = { ...toys[idx], ...toy }
    } else {
        toy.createdAt = Date.now();
        toy._id = utilService.makeId();
        toys.unshift(toy);
    }
    _saveToysToFile();
    return Promise.resolve(toy);
}

function _saveToysToFile() {
    fs.writeFileSync('data/toy.json', JSON.stringify(toys, null, 2));
}
