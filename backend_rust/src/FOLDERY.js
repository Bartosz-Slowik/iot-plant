FOLDERY

F:\    E_POTWIERDZENIA_UE

               2023_POTW_UE

               2023_WZ_UE

               2023_ZAM_UE


[SQL]

@PAR ?@HS50|CDN_GUID|Id:0@? PAR@

    SELECT TrN.TrN_NumerPelny,Trn.TrN_DataDok, R.RpZ2_GIDNumer

    FROM CDN.RptZaznaczenia2 R

    INNER JOIN CDN.TraNag TrN ON TrN.Trn_TrnID = R.RpZ2_GIDNumer

    WHERE R.RpZ2_GUID = ??CDN_GUID

[JS]

//******************************************************************

var temp = "";

var path = "";

while (!Recordset.EOF) \{

    temp = Recordset.Fields("Trn_NumerPelny").Value;

    temp = temp.split("/");

    if(temp[0] == "FA") \{

    path = "F:\\E_POTWIERDZENIA_UE\\" + temp[2] + "_POTW_UE\\";

    }

    else \{

    path = "F:\\E_POTWIERDZENIA_UE\\" + temp[2] + "_ZAM_UE\\";

    }

                try \{

                        new ActiveXObject("WScript.shell").Run(path + temp[1] + ".pdf");

                \} catch (e) \{}

 

    Recordset.moveNext();

\}

 