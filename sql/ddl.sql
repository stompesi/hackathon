CREATE TABLE DRIVER (
    LICENSE char(9) NOT NULL,

    KAKAO_ID int NOT NULL,

    CAR_MODEL varchar(50) NOT NULL,
    CAR_NUMBER varchar(10) NOT NULL,

    BUSINESS_NUMBER char(10) NOT NULL,

    ADDRESS_MAIN                varchar(100)   NOT NULL,
    ADDRESS_SUB                 varchar(100)   NOT NULL,
    ZIP_CODE                    varchar(8)     NOT NULL,
    SIDO                        varchar(10)    NOT NULL,
    SIGUNGU                     varchar(10)    NOT NULL,

    LET                         REAL           NOT NULL,
    LONG                        REAL           NOT NULL,

    PHONE_NUMBER                varchar(10)    NOT NULL,

    COMPANNY                    varchar(50),

    PRIMARY KEY (LICENSE)
);

CREATE TABLE VENDER (
    ID                          varchar(50) NOT NULL,
    PASSWD                      varchar(50) NOT NULL,
    
    BUSINESS_NUMBER             char(10) NOT NULL,
    COMPANNY_NAME               varchar(50) NOT NULL,
    COMPANNY_NUMBER             varchar(10) NOT NULL,

    PRIMARY KEY (ID)
);