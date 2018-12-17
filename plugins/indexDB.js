import Vue from 'vue';

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
const IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

const $DB = {
	init(db) {
		let _this = this;
		_this.db = db;
		let req = indexedDB.open('hb_geocode');
		req.onupgradeneeded = (e) => {
			let db = req.result;
			let obStore = db.createObjectStore('geo', {
				keyPath: 'latlng'
			});
			obStore.createIndex('address', 'address', { unique: false });
			obStore.createIndex('province', 'province', { unique: false });
			obStore.createIndex('district', 'district', { unique: false });
			obStore.createIndex('street', 'street', { unique: false });

			obStore = db.createObjectStore('historyTrace', {
				keyPath: 'id'
			});

			obStore.createIndex('polyline', 'polyline', { unique: false });
		};
	},
	Add(payload, table = 'geo') {
		return new Promise((resolve, reject) => {
			let db = indexedDB.open('hb_geocode');
			db.onsuccess = () => {
				db.result.transaction(table, 'readwrite').objectStore(table).add(payload);
				db.result.close();
				resolve();
			};
			db.onerror = (e) => {
				reject(e);
			};
		});
	},
	Get(key, table = 'geo') {
		return new Promise((resolve, reject) => {
			let db = indexedDB.open('hb_geocode');
			db.onsuccess = () => {
				let req = db.result.transaction(table, 'readonly').objectStore(table).get(key);
				db.result.close();

				req.onsuccess = (e) => {
					resolve(e.target.result);
				};
				req.onerror = (err) => {
					reject(err);
				};
			};
			db.onerror = (e) => {
				reject(e);
			};
		});
	}
};

export default () => {
	Vue.use({
		install: (Vue) => {
			$DB.init();
			Vue.prototype.$DB = $DB;
		}
	});
};
