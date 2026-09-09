class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export class CircularLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }

  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;
      this.current = this.head;
    } else {
      this.tail.next = newNode;
      newNode.next = this.head;
      this.tail = newNode;
    }
  }

  rotar() {
    if (this.current) {
      this.current = this.current.next;
    }
    return this.getMedicoActual();
  }

  getMedicoActual() {
    return this.current ? this.current.value : null;
  }

  toArray() {
    if (!this.head) return [];
    const arr = [];
    let curr = this.head;
    do {
      arr.push(curr.value);
      curr = curr.next;
    } while (curr !== this.head);
    return arr;
  }
}