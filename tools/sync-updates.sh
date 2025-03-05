#!/bin/bash

# copy dependecies from root package.json to lib package.json
# use it like: ./tools/sync-updates.sh ai @ai-sdk/anthropic

# Paths to package.json files
ROOT_PACKAGE="./package.json"
LIB_PACKAGE="./libs/core/package.json"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed. Please install jq first."
    exit 1
fi

# Check if files exist
if [ ! -f "$ROOT_PACKAGE" ] || [ ! -f "$LIB_PACKAGE" ]; then
    echo "Error: One or both package.json files not found"
    exit 1
fi

# If no arguments provided, use default list
if [ $# -eq 0 ]; then
    echo "Error: No dependencies provided"
    exit 1
else
    DEPS_TO_SYNC=("$@")
fi


# Paths to package.json files
ROOT_PACKAGE="./package.json"
LIB_PACKAGE="./libs/core/package.json"

# Check if jq is installed (required for JSON parsing)
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed. Please install jq first."
    exit 1
fi

# Check if files exist
if [ ! -f "$ROOT_PACKAGE" ] || [ ! -f "$LIB_PACKAGE" ]; then
    echo "Error: One or both package.json files not found"
    exit 1
fi

# Function to get version from package.json
get_version() {
    local package_file=$1
    local dep_name=$2
    local dep_type=$3

    # Use jq to extract version, handling possible null values
    version=$(jq -r ".$dep_type[\"$dep_name\"] // empty" "$package_file")
    echo "$version"
}

# Function to update version in lib package.json
update_version() {
    local dep_name=$1
    local new_version=$2
    local dep_type=$3

    # Create temporary file
    temp_file=$(mktemp)
    
    # Update version in the temporary file
    jq ".$dep_type[\"$dep_name\"] = \"$new_version\"" "$LIB_PACKAGE" > "$temp_file"
    
    # Move temporary file to original
    mv "$temp_file" "$LIB_PACKAGE"
}

# Counter for changes made
changes=0

# Check each dependency type
for dep_type in "dependencies" "devDependencies" "peerDependencies"; do
    echo "Checking $dep_type..."
    
    for dep in "${DEPS_TO_SYNC[@]}"; do
        root_version=$(get_version "$ROOT_PACKAGE" "$dep" "$dep_type")
        lib_version=$(get_version "$LIB_PACKAGE" "$dep" "$dep_type")
        
        # If both versions exist and are different
        if [ ! -z "$root_version" ] && [ ! -z "$lib_version" ] && [ "$root_version" != "$lib_version" ]; then
            echo "Updating $dep from $lib_version to $root_version in $dep_type"
            update_version "$dep" "$root_version" "$dep_type"
            ((changes++))
        fi
    done
done

# Report results
if [ $changes -eq 0 ]; then
    echo "No updates needed"
else
    echo "Updated $changes dependencies"
fi