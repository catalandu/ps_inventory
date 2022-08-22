ESX = nil

TriggerEvent('esx:getSharedObject', function(obj)
	ESX = obj
end)

ESX.RegisterServerCallback("ps_inventory:loadTarget", function(source, cb, target)
	local xTarget = ESX.GetPlayerFromId(target)
	local items = xTarget.getInventory()
	local _items = items

	for key, value in ipairs(_items) do
		local item = MySQL.Sync.fetchAll('SELECT * FROM items WHERE name = @name ', {['@name'] = value.name})
		value.name = item[1].name
		value.label = item[1].label
		value.limit = item[1].limit
		value.rare = value.rare
		value.can_remove = value.canRemove
		value.url = item[1].url


		if value.count <= 0 then
			_items[key] = nil
		end
	end


	cb(_items)
end)

ESX.RegisterServerCallback("ps_inventory:loadmoney", function(source, cb)
	local s = source
	local x = ESX.GetPlayerFromId(s)
	cb(x.getMoney())
end)

RegisterNetEvent('ps_inventory:useItem')
AddEventHandler('ps_inventory:useItem', function(name)
	if name ~= nil then
		ESX.UseItem(source, name)
	end
end)

RegisterNetEvent('ps_inventory:throwItem')
AddEventHandler('ps_inventory:throwItem', function(name, count)
	local _source = source
	local xPlayer = ESX.GetPlayerFromId(_source)

	if name ~= nil then
		xPlayer.removeInventoryItem(name, count)
	end
end)

RegisterNetEvent('ps_inventory:throwCash')
AddEventHandler('ps_inventory:throwCash', function(count)
	local _source = source
	local xPlayer = ESX.GetPlayerFromId(_source)

	xPlayer.removeMoney(count)
	TriggerClientEvent('ps_inventory:setMoney', source, xPlayer.getMoney())
end)

RegisterNetEvent('ps_inventory:giveItem')
AddEventHandler('ps_inventory:giveItem', function(name, count, target)
	local _source = source
	local xPlayer = ESX.GetPlayerFromId(_source)
	local xTarget = ESX.GetPlayerFromId(target)

	xPlayer.removeInventoryItem(name, count)
	TriggerClientEvent('ps_notification:showNotification', _source, "Du hast jemanden was in die Tasche gesteckt")

	xTarget.addInventoryItem(name, count)
	TriggerClientEvent('ps_notification:showNotification', target, "Dir wurde etwas in die Tasche gesteckt")

	TriggerClientEvent('ps_inventory:setMax', source, count)
end)

RegisterNetEvent('ps_inventory:giveCash')
AddEventHandler('ps_inventory:giveCash', function(count, target)
	local _source = source
	local xPlayer = ESX.GetPlayerFromId(_source)
	local xTarget = ESX.GetPlayerFromId(target)

	xPlayer.removeMoney(count)
	TriggerClientEvent('ps_notification:showNotification', _source, "Du hast jemanden Geld zugesteckt")

	xTarget.addMoney(count)
	TriggerClientEvent('ps_notification:showNotification', target, "Dir wurde Geld zugesteckt")

	TriggerClientEvent('ps_inventory:setMax', source, count - 1)
	TriggerClientEvent('ps_inventory:setMax', target, 1 - count)
end)