import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Scooter {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('float')
    latitude: number;

    @Column('float')
    longitude: number;

    @Column()
    battery: number;

    @Column({ default: true })
    isAvailable: boolean; // Şimdilik kullanılmıyor ama mantıklı
}
