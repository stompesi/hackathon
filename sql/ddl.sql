CREATE TABLE `hackathon`.`DRIVER` (
  `LICENSE` CHAR(9) NOT NULL,
  `KAKAO_ID` INT NULL,
  `CAR_MODEL` VARCHAR(50) NULL,
  `name` VARCHAR(50) NULL,
  `CAR_NUMBER` VARCHAR(10) NULL,
  `BUSINESS_NUMBER` CHAR(10) NULL,
  `ADDRESS_MAIN` VARCHAR(100) NULL,
  `ADDRESS_SUB` VARCHAR(100) NULL,
  `ZIP_COD` VARCHAR(8) NULL,
  `SIDO` VARCHAR(10) NULL,
  `SIGUNGU` VARCHAR(10) NULL,
  `LET` DECIMAL(14,3) NULL,
  `LONG` DECIMAL(14,3) NULL,
  `PHONE_NUMBER` VARCHAR(10) NULL,
  `COMPANNY` VARCHAR(45) NULL,
  PRIMARY KEY (`LICENSE`)
) DEFAULT CHARACTER SET = DEFAULT;

CREATE TABLE VENDOR (
    ID                          varchar(50) NOT NULL,
    PASSWD                      varchar(50) NOT NULL,
    
    BUSINESS_NUMBER             char(10) NOT NULL,
    COMPANNY_NAME               varchar(50) NOT NULL,
    COMPANNY_NUMBER             varchar(10) NOT NULL,

    PRIMARY KEY (ID)
);

CREATE TABLE CAGO (
    SEQ                       INT NOT NULL AUTO_INCREMENT,
    CAR_MODEL                 varchar(50) NOT NULL,
    EXTERNAL_CAR_MODEL        varchar(50),

    WISH_CARRY                varchar(50) NOT NULL,
    EXTERNAL_WISH_CARRY       varchar(50),
    
    START_POINT               varchar(50) NOT NULL,
    START_DAY                 varchar(50) NOT NULL,
    START_TIME                varchar(50) NOT NULL,
    
    DESTNATION_POINT          varchar(50) NOT NULL,
    DESTNATION_DAY            varchar(50) NOT NULL,
    DESTNATION_TIME           varchar(50) NOT NULL,

    PRIMARY KEY (SEQ)
);