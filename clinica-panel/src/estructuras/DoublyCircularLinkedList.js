class DoubleNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export class DoublyCircularLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(value) {
    const newNode = new DoubleNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;
      newNode.prev = this.head;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      newNode.next = this.head;
      this.head.prev = newNode;
      this.tail = newNode;
    }
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