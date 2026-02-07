import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

export class FirestoreService {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  }

  async create(data) {
    try {
      const docRef = await this.collection.add({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async createWithId(id, data) {
    try {
      await this.collection.doc(id).set({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
      return { id, ...data };
    } catch (error) {
      throw new Error(`Error creating document with ID: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error finding document: ${error.message}`);
    }
  }

  async findByField(field, value) {
    try {
      const snapshot = await this.collection.where(field, '==', value).get();
      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      return results;
    } catch (error) {
      throw new Error(`Error finding documents: ${error.message}`);
    }
  }

  async findOneByField(field, value) {
    try {
      const snapshot = await this.collection.where(field, '==', value).limit(1).get();
      if (snapshot.empty) {
        return null;
      }
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error finding document: ${error.message}`);
    }
  }

  async updateById(id, data) {
    try {
      await this.collection.doc(id).update({
        ...data,
        updatedAt: FieldValue.serverTimestamp()
      });
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const snapshot = await this.collection.get();
      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      return results;
    } catch (error) {
      throw new Error(`Error finding documents: ${error.message}`);
    }
  }

  async addToArray(id, field, value) {
    try {
      await this.collection.doc(id).update({
        [field]: FieldValue.arrayUnion(value),
        updatedAt: FieldValue.serverTimestamp()
      });
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error adding to array: ${error.message}`);
    }
  }

  async removeFromArray(id, field, value) {
    try {
      await this.collection.doc(id).update({
        [field]: FieldValue.arrayRemove(value),
        updatedAt: FieldValue.serverTimestamp()
      });
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error removing from array: ${error.message}`);
    }
  }

  async query(conditions = [], orderBy = null, limit = null) {
    try {
      let query = this.collection;
      
      conditions.forEach(condition => {
        const { field, operator, value } = condition;
        query = query.where(field, operator, value);
      });

      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
      }

      if (limit) {
        query = query.limit(limit);
      }

      const snapshot = await query.get();
      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      return results;
    } catch (error) {
      throw new Error(`Error querying documents: ${error.message}`);
    }
  }
}