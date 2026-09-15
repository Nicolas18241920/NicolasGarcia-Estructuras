export class DoubleNode<T> {
  data: T;
  next: DoubleNode<T> | null = null;
  prev: DoubleNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

export class DoublyLinkedList<T> {
  head: DoubleNode<T> | null = null;

  append(data: T): DoubleNode<T> {
    const newNode = new DoubleNode(data);
    if (!this.head) {
      this.head = newNode;
      return newNode;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
    newNode.prev = current;
    return newNode;
  }
}