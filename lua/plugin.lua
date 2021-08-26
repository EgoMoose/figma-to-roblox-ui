local StarterGui = game:GetService("StarterGui")
local StudioService = game:GetService("StudioService")

local toolbar = plugin:CreateToolbar("Figma")
local button = toolbar:CreateButton("Import UI", "Import Roblox UI from serialized Figma UI", "")

local NON_SERIALIZED = {
	["ClassName"] = true,
	["Children"] = true,
}

local function createInstance(serialized)
	local instance = Instance.new(serialized.ClassName)

	for property, value in pairs(serialized) do
		if not NON_SERIALIZED[property] then
			instance[property] = value
		end
	end

	for _, child in ipairs(serialized.Children or {}) do
		local childInstance = createInstance(child)
		childInstance.Parent = instance
	end

	return instance
end

local function getExtension(file)
	local list = string.split(file.Name, ".")
	return list[#list]
end

button.Click:Connect(function()
	button.Enabled = false

	local lua, luaFile = nil, nil
	local module = Instance.new("ModuleScript")
	local imageFiles = {}
	local files = StudioService:PromptImportFiles({"lua", "png"}) or {}

	for _, file in pairs(files) do
		local extension = getExtension(file)
		if extension == "lua" then
			luaFile = file
			module.Source = luaFile:GetBinaryContents()
			lua = require(module)
		else
			imageFiles[tonumber(file.Name:sub(1, -5))] = file
		end
	end

	local queue = {lua}
	while #queue > 0 do
		local serial = table.remove(queue)

		if serial.Image then
			local stripped = string.gsub(serial.Image, "figma://", "")
			local imageFile = imageFiles[tonumber(stripped)]
			serial.Image = imageFile:GetTemporaryId()
		end

		for _, child in pairs(serial.Children or {}) do
			table.insert(queue, child)
		end
	end

	local screen = Instance.new("ScreenGui")
	screen.Name = luaFile.Name:sub(1, -5)
	screen.Parent = StarterGui

	local instance = createInstance(lua)
	instance.Position = UDim2.new(0, 100, 0, 100)
	instance.Parent = screen

	module:Destroy()

	button.Enabled = true
end)