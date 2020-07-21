create table tags(
    id serial primary key,
    name text unique not null,
    color varchar(10),
    visible boolean not null
);

create table categories(
    id serial primary key,
    name text unique not null,
    color varchar(10),
    visible boolean not null
);

create table products(
    id serial primary key,
    name text unique not null,
    manifacturer text not null,
    description text not null,
    cost money not null,
    category_id int REFERENCES categories(id),
    visible boolean not null
);

create table product_tags(
    id serial primary key,
    product_id int REFERENCES products(id),
    tag_id int REFERENCES tags(id)
);

create table users(
    id serial primary key,
    username varchar(30) unique not null,
    password text not null,
    email text not null,
    created_on timestamp not null,
    last_login timestamp,
    role text not null
);

create table cart(
    id serial primary key,
    user_id int REFERENCES users(id),
    created_date timestamp not null
);

create table cart_items(
    id serial primary key,
    product_id int REFERENCES products(id),
    quantity int not null,
    created_date timestamp not null,
    cart_id int REFERENCES cart(id)
);

create table orders(
    id serial primary key,
    cart_id int REFERENCES cart(id),
    payed money not null,
    reciever_name text not null,
    address text not null
);

create table product_ratings(
    id serial primary key,
    user_id int REFERENCES users(id),
    product_id int REFERENCES products(id),
    rating smallint not null
);