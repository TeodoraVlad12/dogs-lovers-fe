export class Consultation {
    date: Date;
    medicationUsed: string;
    notes: string;

    constructor(date: Date, medicationUsed: string, notes: string) {
        this.date = date;
        this.medicationUsed = medicationUsed;
        this.notes = notes;
    }
}
