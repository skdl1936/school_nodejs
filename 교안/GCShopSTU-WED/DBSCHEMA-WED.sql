use webdb2024;

CREATE TABLE person (
   loginid varchar(10) NOT NULL,
   password varchar(20) NOT NULL,
   name  varchar(20) NOT NULL,
   address varchar(100),
   tel varchar(13), 
   birth varchar(8) NOT NULL,
   class varchar(3) NOT NULL, 
   grade varchar(1) NOT NULL,
   PRIMARY KEY (loginid)
); 

insert into person values('M','M', '관리자', '서울', '010','00000000','MNG','S'); 
insert into person values('CEO','CEO', '경영진','서울', 010, '00000000', 'CEO','S');

SELECT * FROM person;


CREATE TABLE code (
   main_id varchar(4) NOT NULL,
   sub_id varchar(4) NOT NULL,
   main_name  varchar(20) NOT NULL,
   sub_name varchar(100),
   start varchar(8) NOT NULL,
   end varchar(8) NOT NULL,
   PRIMARY KEY (main_id, sub_id, start)
); 

select * from code;
drop table code;

CREATE TABLE product (
   main_id varchar(4) NOT NULL,
   sub_id varchar(4) NOT NULL,
   mer_id int NOT NULL AUTO_INCREMENT,
   name  varchar(300) NOT NULL,
   price int NOT NULL,
   stock int NOT NULL,
   brand varchar(50) NOT NULL,
   supplier varchar(50) NOT NULL,
   image varchar(50), 
   sale_yn varchar(1) NOT NULL,
   sale_price int,    
   PRIMARY KEY (mer_id)
); 
drop table product;

