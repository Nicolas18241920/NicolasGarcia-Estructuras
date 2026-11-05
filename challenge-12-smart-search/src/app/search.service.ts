import { Injectable } from '@angular/core';
import { db } from './firebase.config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Trie, MaxHeap, Product } from './models/trie-heap.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private trie = new Trie();
  private productsCollection = collection(db, 'products');

  // Carga los productos guardados en Firestore e inicializa el Trie
  async loadProducts(): Promise<void> {
    this.trie = new Trie();
    const querySnapshot = await getDocs(this.productsCollection);
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data() as Product;
      this.trie.insert(data.name, data.popularity);
    });
  }

  // Inserta en BD y actualiza la estructura Trie en memoria
  async addProduct(name: string, popularity: number): Promise<void> {
    await addDoc(this.productsCollection, { name, popularity });
    this.trie.insert(name, popularity);
  }

  // Algoritmo Smart Search: Prefijo con Trie + Top-K con MaxHeap
  searchTopK(prefix: string, k: number): Product[] {
    if (!prefix.trim()) return [];

    // 1. Obtener coincidencia de prefijos en O(L) usando el Trie
    const matches = this.trie.getProductsByPrefix(prefix);

    // 2. Construir el MaxHeap en O(N)
    const maxHeap = new MaxHeap(matches);

    // 3. Extraer los K elementos más populares en O(K log N)
    const topK: Product[] = [];
    const iterations = Math.min(k, maxHeap.size());

    for (let i = 0; i < iterations; i++) {
      const top = maxHeap.pop();
      if (top) topK.push(top);
    }

    return topK;
  }
}
