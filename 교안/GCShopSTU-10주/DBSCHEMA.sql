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
insert into person values('CEO','C', '경영자', '서울', '010','00000000','CEO','S');
insert into person values('CST','C', '고객', '서울', '010','00000000','CST','S');

SELECT * FROM person;

drop table person;



CREATE TABLE code (
   main_id varchar(4) NOT NULL,
   sub_id varchar(4) NOT NULL,
   main_name  varchar(20) NOT NULL,
   sub_name varchar(100),
   start varchar(8) NOT NULL,
   end varchar(8) NOT NULL,
   PRIMARY KEY (main_id, sub_id, start)
); 
INSERT INTO code (main_id, sub_id, main_name, sub_name, start, end) VALUES
('0000', '0001', '남성의류', '아우터', '20241003', '20241020'),
('0001', '0001', '여성의류', '아우터', '20241003', '20241020'),
('0002', '0002', '남성하의', '바지', '20241003', '20241020'),
('0003', '0002', '여성하의', '바지', '20241003', '20241020');

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

select * from product;


drop table product;

CREATE TABLE boardtype (
   type_id int NOT NULL AUTO_INCREMENT,
   title varchar(200) NOT NULL,
   description varchar(400),
   write_YN varchar(1) NOT NULL,
   re_YN varchar(1) NOT NULL,
   numPerPage int, 
   PRIMARY KEY (type_id)
); 
drop table boardtype;

select * from boardtype;


CREATE TABLE board (
   type_id int,
   board_id int NOT NULL AUTO_INCREMENT,
   p_id int,
   loginid varchar(10) NOT NULL,
   password varchar(20),
   title varchar(200) NOT NULL,
   date varchar(50),
   content text,
   PRIMARY KEY (board_id)
);
insert into board values(4,1,0,'asdf','asdf','신고합니다.','20241107','는구라에요');
select * from board;

drop table board;

CREATE TABLE purchase (
   purchase_id int NOT NULL AUTO_INCREMENT,
   loginid varchar(10) NOT NULL,
   mer_id int NOT NULL,
   date varchar(30) NOT NULL,
   price int, 
   point int, 
   qty int, 
   total int, 
   payYN varchar(1) NOT NULL,
   cancel varchar(1) NOT NULL, 
   refund varchar(1) NOT NULL, 
   PRIMARY KEY (purchase_id)
);  

drop table purchase;

CREATE TABLE cart (
   cart_id int NOT NULL AUTO_INCREMENT,
   loginid varchar(10) NOT NULL,
   mer_id int NOT NULL,
   date varchar(30) NOT NULL,
   PRIMARY KEY (cart_id)
);  

select * from cart;