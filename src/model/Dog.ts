class Dog {
    private _id: number;
    private _name: string;
    private _weight: number;
    private _age: number;

    constructor(id: number, name: string, weight: number, age: number) {
        this._id = id;
        this._name = name;
        this._weight = weight;
        this._age = age;
    }

    // Getters for private properties
    getId(): number {
        return this._id;
    }

    getName(): string {
        return this._name;
    }

    getWeight(): number {
        return this._weight;
    }

    getAge(): number {
        return this._age;
    }

    setName(name: string): void {
        this._name = name;
    }

    setAge(age: number): void {
        this._age = age;
    }

    setWeight(weight: number): void {
        this._weight = weight;
    }
}


export {Dog};