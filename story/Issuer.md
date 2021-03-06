# Пример использования для Эмитента IPCI

## Начало работы

1. *Эмитент* создаёт аккаунт в сети Ethereum
2. *Эмитент* выбирает *Оператора* из списка [operator address list][1]
3. *Эмитент* выбирает *Аудитора* 
4. *Эмитент* вызывает метод `create` контракта [BuilderIssuerLedger][2] из ДАО *Оператора*, указывая:
  - Имя токена
  - Адрес ДАО *Оператора*
  - Имя группы *Аудитора*
5. *Эмитент* вызывает метод `getLastContract` контракта [BuilderIssuerLedger][2]
6. Полученный на предыдущем шаге адрес [InsuranceHolder][3] *Эмитент* сохраняет для дальнейшей работы в сети
7. Из поля `token` контракта [InsuranceHolder][3] *Эмитент* получает адрес токена в сети и сохраняет для дальнейшей работы  
8. *Эмитент* сообщает *Аудитору* адрес контракта [InsuranceHolder][3] и адрес контракта токена
9. *Эмитент* готов для работы с **DAO IPCI**

[1]: https://github.com/airalab/DAO-IPCI/blob/master/OperatorList.md
[2]: https://github.com/airalab/DAO-IPCI/blob/master/contracts/builder/BuilderIssuerLedger.sol
[3]: https://github.com/airalab/DAO-IPCI/blob/master/contracts/InsuranceHolder.sol

## Эмиссия

1. *Эмитент* договаривается с *Аудитором* о выпуске токенов IPCI
2. *Эмитент* получает перевод от *Аудитора* за вычетом страхового взноса

## Возврат страхового взноса

1. Вызывая метод `record` контракта [InsuranceHolder][3] с целочисленным аргументом, *Эмитент* получает информацию о страховых взносах в формате:
  - Метка времени (UNIX time)
  - Величина взноса
  - Состояние взноса (`false`: взнос находится на балансе контракта, `true`: взнос был выведен)
2. По-прошествии `holdDuration` секунд, указанных в контракте [InsuranceHolder][3], *Эмитент* вызывает метод `withdraw` с указанием индекса возвращаемого взноса
3. Средства полностью переводятся на адрес аккаунта *Эмитента*

## Торговля на рынке

1. *Эмитент* вызывает метод `append` контракта [Market][4] из **DAO IPCI**, указывая:
  - Адрес своего аккаунта
  - Адрес токена для продажи (эмиссируемый IPCI-токен)
  - Адрес токена для покупки (например, `ether`)
  - Количество продаваемых токенов
  - Количество покупаемых токенов
2. Для добавленного лота *Эмитент* выполняет `approve` токена на сумму, указанную для продажи

[4]: https://github.com/airalab/core/blob/master/sol/market/Market.sol
