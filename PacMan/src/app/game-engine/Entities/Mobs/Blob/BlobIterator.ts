import { Blob } from 'src/app/game-engine/Entities/Mobs/Blob/blobEntity.model';
/**
 * Iterator Design Pattern
 *
 * Intent: Lets you traverse elements of a collection without exposing its
 * underlying representation (list, stack, tree, etc.).
 */

interface Iterator<Blob> {
  // Return the current element.
  current(): Blob;

  // Return the current element and move forward to next element.
  next(): Blob;

  // Return the key of the current element.
  key(): number;

  // Checks if current position is valid.
  valid(): boolean;

  // Rewind the Iterator to the first element.
  rewind(): void;
}

interface Aggregator {
  // Retrieve an external iterator.
  getIterator(): Iterator<Blob>;
}

/**
 * Concrete Iterators implement various traversal algorithms. These classes
 * store the current traversal position at all times.
 */

export class BlobIterator implements Iterator<Blob> {
  private collection: BlobCollection;

  /**
   * Stores the current traversal position. An iterator may have a lot of
   * other fields for storing iteration state, especially when it is supposed
   * to work with a particular kind of collection.
   */
  private position: number = 0;

  /**
   * This variable indicates the traversal direction.
   */
  private reverse: boolean = false;

  constructor(collection: BlobCollection, reverse: boolean = false) {
    this.collection = collection;
    this.reverse = reverse;

    if (reverse) {
      this.position = collection.getCount() - 1;
    }
  }

  public rewind() {
    this.position = this.reverse ? this.collection.getCount() - 1 : 0;
  }

  public current(): Blob {
    return this.collection.getItems()[this.position];
  }

  public key(): number {
    return this.position;
  }

  public next(): Blob {
    const item = this.collection.getItems()[this.position];
    this.position += this.reverse ? -1 : 1;
    return item;
  }

  public valid(): boolean {
    if (this.reverse) {
      return this.position >= 0;
    }

    return this.position < this.collection.getCount();
  }
}

/**
 * Concrete Collections provide one or several methods for retrieving fresh
 * iterator instances, compatible with the collection class.
 */
export class BlobCollection implements Aggregator {
  private items: Blob[] = [];

  public getItems(): Blob[] {
    return this.items;
  }

  public getCount(): number {
    return this.items.length;
  }

  public addItem(item: Blob): void {
    this.items.push(item);
  }

  public getIterator(): Iterator<Blob> {
    return new BlobIterator(this);
  }

  public getReverseIterator(): Iterator<Blob> {
    return new BlobIterator(this, true);
  }
}

/**
 * The client code may or may not know about the Concrete Iterator or Collection
 * classes, depending on the level of indirection you want to keep in your
 * program.
 */
const collection = new BlobCollection();
