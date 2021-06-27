import mongoose from "mongoose";

const { Schema } = mongoose;
mongoose.set('useCreateIndex', true);

const peopleSchema = new Schema({
  ssn: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  severity: { type: Number, required: true },
  location: {
    name: { type: String, required: true },
    description: { type: String, required: false },
  },
});

const People = mongoose.model("People", peopleSchema);
const db = { People };
module.exports = db;

// function writeData(store) {
//     const s = JSON.stringify(store, null, 2);
//     fs.writeFileSync(STORE_PATH, s);
// }

// function createProxy(data, name, store, value, isSet) {
//     // console.log("CREATE_PROXY", data, name, data[name])
//     if (isSet) {
//         data[name] = value;
//         writeData(store);
//         return value;
//     }
//     if (typeof(data[name]) === 'function') {
//         return (...args) => {
//             const r = data[name](...args);
//             writeData(store);
//             return r;
//         };
//     }
//     if (
//         data[name] === null
//         || typeof(data[name]) === 'undefined'
//         || typeof(data[name]) === 'boolean'
//         || typeof(data[name]) === 'number'
//         || typeof(data[name]) === 'string'
//     ) return data[name];
//     try {
//         const proxy = new Proxy(data[name], {
//             get(t, n) {
//                 // console.log('CREATE_PROXY_GET', t, n, data, name)
//                 return createProxy(data[name], n, store);
//             },
//             set(t, n, v) {
//                 // console.log('CREATE_PROXY_SET', t, n, data, name)
//                 return createProxy(data[name], n, store, v, true)
//             }
//         });
//         return proxy;
//     } catch (error) {
//         console.log(error);
//         console.log(data, name, data[name], typeof(data[name]))
//         return data[name];
//     }

// }

// const db = new Proxy({}, {
//     get(target, name) {
//         // console.log(target, 'GET ROOT')
//         const data = JSON.parse(fs.readFileSync(STORE_PATH));
//         return createProxy(data, name, data);
//     },
//     set(target, name, value) {
//         // console.log('SET ROOT')
//         const data = JSON.parse(fs.readFileSync(STORE_PATH));
//         return createProxy(data, name, data, value, true);
//     }
// });
