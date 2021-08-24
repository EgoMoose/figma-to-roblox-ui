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

button.Click:Connect(function()
	button.Enabled = false

	local files = StudioService:PromptImportFiles({"lua"}) or {}

	for _, file in pairs(files) do
		local module = Instance.new("ModuleScript")
		module.Source = file:GetBinaryContents()

		local lua = require(module)

		local screen = Instance.new("ScreenGui")
		screen.Name = file.Name:sub(1, -5)
		screen.Parent = StarterGui

		local instance = createInstance(lua)
		instance.Parent = screen

		module:Destroy()
	end

	button.Enabled = true
end)