Проект фильтрации городов по определенным параметрам (запросу) на NODE JS

1. Запуск проекта: node cities "параметры"

2. В качестве исходного объекта используется файл cities.json. Результат выводится в файл output.json

3. Возможные запросы: 
Первое слово указывает сколько элементов. Возможные значения: all (все элементы, удовлетворяющие условию). Либо last, либо first (последний или первый элемент). Вместо слов может быть указано число, тогда выводится такое же число элементов, удовлетворяющих условию.
Вторая часть - условие. Обязательно слово where, затем по какому полю фильтруем %number% (%region%, %city%) и логическое условие (больше, меньше или равно)
Примеры:
    all where %number%>4 - все, где number>4
    all where %region%=Тюменская обл. - все, где region = Тюменская обл.
    10 where %number%<4 - 10 первых, где number<4
    1 where %city%=Москва - 1, где city = Москва

не пропускает:
    all where %number%> (нет с чем сравнивать)
    "10 %number%>4 - нет where
