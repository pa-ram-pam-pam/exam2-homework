пропускает:
    "all"
    "10"
    "first"
    "last"

    all where %number%>4
    all where %region%=Тюменская обл.
    10 where %number%<4
    1 where %city%=Москва


не пропускает:
    all where %number%> (нет с чем сравнивать)
    "10 %number%>4 - нет where