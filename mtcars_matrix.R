# Load required packages
required_packages <- c("ggplot2", "reshape2", "MASS", "car")
for(pkg in required_packages) {
    if(!require(pkg, character.only = TRUE)) {
        install.packages(pkg)
        library(pkg, character.only = TRUE)
    }
}

# Verify ggplot2 package is loaded
if(!require(ggplot2)) {
    install.packages("ggplot2")
    library(ggplot2)
}

# Verify MASS package is loaded
if(!require(MASS)) {
    install.packages("MASS")
    library(MASS)
}

# Verify car package is loaded
if(!require(car)) {
    install.packages("car")
    library(car)
}

# Load the mtcars dataset
data(mtcars)

# Convert mtcars to a matrix
# First, store the row names (car names)
car_names <- rownames(mtcars)

# Convert to matrix
mtcars_matrix <- as.matrix(mtcars)

# Add back the row names
rownames(mtcars_matrix) <- car_names

# Convert to data frame for easier analysis
mtcars_df <- as.data.frame(mtcars_matrix)
mtcars_df$am <- factor(mtcars_df$am, levels = c(0, 1), labels = c("Automatic", "Manual"))

# Calculate average MPG for each transmission type
auto_mpg <- mean(mtcars_df$mpg[mtcars_df$am == "Automatic"])
manual_mpg <- mean(mtcars_df$mpg[mtcars_df$am == "Manual"])

# Calculate the difference
mpg_difference <- manual_mpg - auto_mpg
percent_difference <- (mpg_difference / auto_mpg) * 100

# Print results
print("\nMPG Comparison between Transmission Types:")
print(paste("Automatic Transmission Average MPG:", round(auto_mpg, 2)))
print(paste("Manual Transmission Average MPG:", round(manual_mpg, 2)))
print(paste("Difference in MPG (Manual - Automatic):", round(mpg_difference, 2)))
print(paste("Percentage Difference:", round(percent_difference, 2), "%"))

# Create a bar plot to visualize the difference
ggplot(mtcars_df, aes(x = am, y = mpg, fill = am)) +
    stat_summary(fun = mean, geom = "bar") +
    stat_summary(fun.data = mean_se, geom = "errorbar", width = 0.2) +
    geom_jitter(width = 0.2, alpha = 0.5) +
    theme_minimal() +
    labs(title = "Average MPG by Transmission Type",
         x = "Transmission Type",
         y = "Miles per Gallon (MPG)") +
    scale_fill_manual(values = c("Automatic" = "lightblue", "Manual" = "lightgreen")) +
    annotate("text", x = 1.5, y = max(c(auto_mpg, manual_mpg)) + 1,
             label = paste("Difference:", round(mpg_difference, 2), "MPG"))

# Perform t-test to check if the difference is statistically significant
t_test_result <- t.test(mpg ~ am, data = mtcars_df)
print("\nStatistical Test Results:")
print(t_test_result)

# Print conclusion
print("\nConclusion:")
if(t_test_result$p.value < 0.05) {
    if(mpg_difference > 0) {
        print(paste("Manual transmission cars have significantly better MPG than automatic transmission cars by", 
                   round(mpg_difference, 2), "MPG (", round(percent_difference, 2), "% better)."))
    } else {
        print(paste("Automatic transmission cars have significantly better MPG than manual transmission cars by", 
                   round(abs(mpg_difference), 2), "MPG (", round(abs(percent_difference), 2), "% better)."))
    }
} else {
    print("There is no significant difference in MPG between manual and automatic transmission cars.")
}

# Calculate summary statistics for MPG by transmission type
mpg_by_trans <- aggregate(mpg ~ am, data = mtcars_df, FUN = function(x) c(
    mean = mean(x),
    sd = sd(x),
    min = min(x),
    max = max(x),
    n = length(x)
))
print("\nMPG Summary by Transmission Type:")
print(mpg_by_trans)

# Create boxplot of MPG by transmission type
p1 <- ggplot(mtcars_df, aes(x = am, y = mpg, fill = am)) +
    geom_boxplot() +
    geom_jitter(width = 0.2, alpha = 0.5) +
    theme_minimal() +
    labs(title = "MPG Distribution by Transmission Type",
         x = "Transmission Type",
         y = "Miles per Gallon (MPG)") +
    scale_fill_manual(values = c("Automatic" = "lightblue", "Manual" = "lightgreen"))

# Create density plot
p2 <- ggplot(mtcars_df, aes(x = mpg, fill = am)) +
    geom_density(alpha = 0.5) +
    theme_minimal() +
    labs(title = "MPG Density by Transmission Type",
         x = "Miles per Gallon (MPG)",
         y = "Density") +
    scale_fill_manual(values = c("Automatic" = "lightblue", "Manual" = "lightgreen"))

# Print both plots
print(p1)
print(p2)

# Calculate correlation between transmission and MPG
cor_am_mpg <- cor(mtcars_matrix[, "am"], mtcars_matrix[, "mpg"])
print("\nCorrelation between transmission type and MPG:")
print(cor_am_mpg)

# Create a linear model to predict MPG from transmission type
mpg_model <- lm(mpg ~ am, data = mtcars_df)
print("\nLinear model results:")
print(summary(mpg_model))

# Create a more complex model including other relevant variables
complex_model <- lm(mpg ~ am + wt + qsec + cyl, data = mtcars_df)
print("\nComplex model results (including weight, quarter mile time, and cylinders):")
print(summary(complex_model))

# Print additional insights
print("\nAdditional Insights:")
print("1. Average MPG by transmission type:")
print(paste("   Automatic:", round(mean(mtcars_df$mpg[mtcars_df$am == "Automatic"]), 2), "MPG"))
print(paste("   Manual:", round(mean(mtcars_df$mpg[mtcars_df$am == "Manual"]), 2), "MPG"))
print("2. MPG range by transmission type:")
print(paste("   Automatic:", round(min(mtcars_df$mpg[mtcars_df$am == "Automatic"]), 2), "-", 
            round(max(mtcars_df$mpg[mtcars_df$am == "Automatic"]), 2), "MPG"))
print(paste("   Manual:", round(min(mtcars_df$mpg[mtcars_df$am == "Manual"]), 2), "-", 
            round(max(mtcars_df$mpg[mtcars_df$am == "Manual"]), 2), "MPG"))

# Basic data check
print("Checking data structure:")
print(str(mtcars_matrix))
print("\nChecking for missing values:")
print(colSums(is.na(mtcars_matrix)))

# Calculate correlation matrix
tryCatch({
    full_cor_matrix <- cor(mtcars_matrix)
    print("\nCorrelation matrix calculated successfully")
}, error = function(e) {
    print("Error calculating correlation matrix:")
    print(e)
})

# Calculate average correlations
tryCatch({
    # Remove diagonal elements and calculate mean absolute correlation
    avg_correlations <- colMeans(abs(full_cor_matrix - diag(ncol(full_cor_matrix))))
    
    # Create a data frame with the results
    avg_cor_df <- data.frame(
        Variable = names(avg_correlations),
        Avg_Correlation = avg_correlations
    )
    
    # Sort by average correlation
    avg_cor_df <- avg_cor_df[order(avg_cor_df$Avg_Correlation, decreasing = TRUE), ]
    
    # Print the results
    print("\nAverage correlation with all other variables:")
    print(avg_cor_df)
    
    # Find the variable with highest average correlation
    highest_avg_cor_var <- avg_cor_df$Variable[1]
    highest_avg_cor_value <- avg_cor_df$Avg_Correlation[1]
    
    print("\nVariable with the highest average correlation:")
    print(paste("Variable:", highest_avg_cor_var))
    print(paste("Average correlation:", round(highest_avg_cor_value, 3)))
    
    # Create visualization
    p <- ggplot(avg_cor_df, aes(x = reorder(Variable, Avg_Correlation), y = Avg_Correlation)) +
        geom_bar(stat = "identity", fill = ifelse(avg_cor_df$Variable == highest_avg_cor_var, "red", "steelblue")) +
        theme_minimal() +
        theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
        labs(title = "Average Correlation with All Other Variables",
             subtitle = paste("Highest average correlation:", highest_avg_cor_var),
             x = "Variable",
             y = "Average Absolute Correlation")
    
    print(p)
    
}, error = function(e) {
    print("Error in correlation analysis:")
    print(e)
})

# Display the first few rows of the matrix
print("\nFirst few rows of the matrix:")
print(head(mtcars_matrix))

# Display the structure of the matrix
print("\nStructure of the matrix:")
str(mtcars_matrix)

# Display the dimensions of the matrix
print("\nDimensions of the matrix:")
print(dim(mtcars_matrix))

# Display the column names
print("\nColumn names:")
print(colnames(mtcars_matrix))

# Display the row names (car names)
print("\nCar names (row names):")
print(rownames(mtcars_matrix))

# Calculate the transpose of the matrix
mtcars_transpose <- t(mtcars_matrix)

# Display the dimensions of the transpose
print("\nDimensions of the transpose matrix:")
print(dim(mtcars_transpose))

# Display first few rows of the transpose
print("\nFirst few rows of the transpose matrix:")
print(head(mtcars_transpose))

# Calculate the product of the matrix and its transpose
# Note: This will give us a 32x32 matrix (cars x cars)
matrix_product <- mtcars_matrix %*% mtcars_transpose

# Display the dimensions of the product matrix
print("\nDimensions of the product matrix (mtcars_matrix %*% mtcars_transpose):")
print(dim(matrix_product))

# Display the first few rows and columns of the product matrix
print("\nFirst few rows and columns of the product matrix:")
print(matrix_product[1:5, 1:5])

# Create a 3x3 matrix using three continuous variables: mpg, hp, and wt
# We'll use the first three cars to create the matrix
three_var_matrix <- mtcars_matrix[1:3, c("mpg", "hp", "wt")]
print("\n3x3 matrix using mpg, hp, and wt for first three cars:")
print(three_var_matrix)

# Calculate the determinant
det_value <- det(three_var_matrix)
print("\nDeterminant of the 3x3 matrix:")
print(det_value)

# Check if the matrix is invertible (determinant != 0)
if(abs(det_value) > 1e-10) {  # Using a small threshold to account for numerical precision
    print("\nThe matrix is invertible!")
    # Calculate the inverse
    inverse_matrix <- solve(three_var_matrix)
    print("\nInverse of the 3x3 matrix:")
    print(inverse_matrix)
    
    # Verify the inverse by multiplying with original matrix
    identity_check <- three_var_matrix %*% inverse_matrix
    print("\nVerification (should be close to identity matrix):")
    print(round(identity_check, 6))
} else {
    print("\nThe matrix is not invertible (determinant is zero or very close to zero)")
}

# Calculate column means using matrix operations
# Create a vector of ones with length equal to number of rows
ones_vector <- matrix(1, nrow = nrow(mtcars_matrix), ncol = 1)

# Calculate means using matrix multiplication and division
# (X' * 1) / n where X is the data matrix and n is the number of rows
column_means <- (t(mtcars_matrix) %*% ones_vector) / nrow(mtcars_matrix)

# Add column names to the means
rownames(column_means) <- colnames(mtcars_matrix)
colnames(column_means) <- "Mean"

print("\nColumn means calculated using matrix operations:")
print(column_means)

# Verify the results using the built-in colMeans function
print("\nVerification using colMeans function:")
print(colMeans(mtcars_matrix))

# Normalize the dataset and compare model performance
# First, let's create a function to normalize the data
normalize_matrix <- function(x) {
    # Calculate mean and standard deviation for each column
    col_means <- colMeans(x)
    col_sds <- apply(x, 2, sd)
    
    # Create a matrix of means and standard deviations
    means_matrix <- matrix(rep(col_means, each = nrow(x)), nrow = nrow(x))
    sds_matrix <- matrix(rep(col_sds, each = nrow(x)), nrow = nrow(x))
    
    # Normalize the data: (x - mean) / sd
    normalized <- (x - means_matrix) / sds_matrix
    return(normalized)
}

# Normalize the matrix
mtcars_normalized <- normalize_matrix(mtcars_matrix)

# Print summary of original and normalized data
print("\nSummary of original data:")
print(summary(mtcars_matrix))
print("\nSummary of normalized data:")
print(summary(mtcars_normalized))

# Compare model performance
# We'll use mpg as the target variable and hp, wt, and disp as predictors
# Original data model
original_model <- lm(mpg ~ hp + wt + disp, data = as.data.frame(mtcars_matrix))
print("\nModel performance with original data:")
print(summary(original_model))

# Normalized data model
normalized_model <- lm(mpg ~ hp + wt + disp, data = as.data.frame(mtcars_normalized))
print("\nModel performance with normalized data:")
print(summary(normalized_model))

# Compare coefficients
print("\nComparison of coefficients:")
coef_comparison <- data.frame(
    Original = coef(original_model),
    Normalized = coef(normalized_model)
)
print(coef_comparison)

# Compare R-squared values
print("\nComparison of R-squared values:")
r2_comparison <- data.frame(
    Original = summary(original_model)$r.squared,
    Normalized = summary(normalized_model)$r.squared
)
print(r2_comparison)

# Test model assumptions
# Create a function to generate diagnostic plots
create_diagnostic_plots <- function(model, title) {
    # Set up a 2x2 plot layout
    par(mfrow = c(2, 2))
    
    # 1. Residuals vs Fitted (Linearity)
    plot(model, which = 1, main = paste(title, "- Residuals vs Fitted"))
    
    # 2. Normal Q-Q Plot (Normality)
    plot(model, which = 2, main = paste(title, "- Normal Q-Q Plot"))
    
    # 3. Scale-Location Plot (Homoscedasticity)
    plot(model, which = 3, main = paste(title, "- Scale-Location Plot"))
    
    # 4. Residuals vs Leverage (Influential Points)
    plot(model, which = 5, main = paste(title, "- Residuals vs Leverage"))
    
    # Reset plot layout
    par(mfrow = c(1, 1))
}

# Generate diagnostic plots for both models
print("\nGenerating diagnostic plots for original model...")
create_diagnostic_plots(original_model, "Original Model")

print("\nGenerating diagnostic plots for normalized model...")
create_diagnostic_plots(normalized_model, "Normalized Model")

# Test for multicollinearity using VIF (Variance Inflation Factor)
print("\nVIF values for original model:")
print(vif(original_model))

print("\nVIF values for normalized model:")
print(vif(normalized_model))

# Test for normality of residuals
print("\nShapiro-Wilk test for normality of residuals:")
print("Original model:")
print(shapiro.test(residuals(original_model)))
print("Normalized model:")
print(shapiro.test(residuals(normalized_model)))

# Test for homoscedasticity using Breusch-Pagan test
print("\nBreusch-Pagan test for homoscedasticity:")
print("Original model:")
print(bptest(original_model))
print("Normalized model:")
print(bptest(normalized_model))

# Correlation matrix of predictors
print("\nCorrelation matrix of predictors:")
cor_matrix <- cor(mtcars_matrix[, c("hp", "wt", "disp")])
print(cor_matrix)

# Create a heatmap of the correlation matrix
library(ggplot2)
library(reshape2)
cor_melted <- melt(cor_matrix)
ggplot(cor_melted, aes(x = Var1, y = Var2, fill = value)) +
    geom_tile() +
    scale_fill_gradient2(low = "blue", high = "red", mid = "white", 
                        midpoint = 0, limit = c(-1, 1), space = "Lab", 
                        name = "Correlation") +
    theme_minimal() +
    labs(title = "Correlation Heatmap of Predictors")

# Find the car with the highest horsepower
# Get the index of the maximum horsepower
max_hp_index <- which.max(mtcars_matrix[, "hp"])

# Get the car name and its horsepower
max_hp_car <- rownames(mtcars_matrix)[max_hp_index]
max_hp_value <- mtcars_matrix[max_hp_index, "hp"]

# Print the results
print("\nCar with the highest horsepower:")
print(paste("Car:", max_hp_car))
print(paste("Horsepower:", max_hp_value))

# Create a bar plot of the top 5 cars by horsepower
# Sort the cars by horsepower in descending order
sorted_cars <- mtcars_matrix[order(mtcars_matrix[, "hp"], decreasing = TRUE), ]
top_5_cars <- sorted_cars[1:5, ]

# Create the bar plot
barplot(top_5_cars[, "hp"],
        names.arg = rownames(top_5_cars),
        main = "Top 5 Cars by Horsepower",
        xlab = "Car Model",
        ylab = "Horsepower",
        col = "red",
        las = 2)  # Rotate x-axis labels for better readability

# Create a heatmap of the full correlation matrix
# Melt the correlation matrix for ggplot
full_cor_melted <- melt(full_cor_matrix)

# Create the heatmap
ggplot(full_cor_melted, aes(x = Var1, y = Var2, fill = value)) +
    geom_tile() +
    scale_fill_gradient2(low = "blue", high = "red", mid = "white", 
                        midpoint = 0, limit = c(-1, 1), space = "Lab", 
                        name = "Correlation") +
    theme_minimal() +
    theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
    labs(title = "Correlation Heatmap of All Variables",
         x = "",
         y = "")

# Find the strongest correlations
# Create a function to find the strongest correlations
find_strong_correlations <- function(cor_matrix, threshold = 0.7) {
    # Get the upper triangle of the correlation matrix
    upper_tri <- upper.tri(cor_matrix)
    
    # Create a data frame with the correlations
    cor_df <- data.frame(
        Var1 = rownames(cor_matrix)[row(cor_matrix)[upper_tri]],
        Var2 = colnames(cor_matrix)[col(cor_matrix)[upper_tri]],
        Correlation = cor_matrix[upper_tri]
    )
    
    # Filter for strong correlations
    strong_cors <- cor_df[abs(cor_df$Correlation) >= threshold, ]
    
    # Sort by absolute correlation
    strong_cors <- strong_cors[order(abs(strong_cors$Correlation), decreasing = TRUE), ]
    
    return(strong_cors)
}

# Find and print strong correlations
strong_correlations <- find_strong_correlations(full_cor_matrix)
print("\nStrong correlations (|r| >= 0.7):")
print(strong_correlations)

# Create a bar plot of average correlations
ggplot(avg_cor_df, aes(x = reorder(Variable, Avg_Correlation), y = Avg_Correlation)) +
    geom_bar(stat = "identity", fill = "steelblue") +
    theme_minimal() +
    theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
    labs(title = "Average Correlation with All Other Variables",
         x = "Variable",
         y = "Average Absolute Correlation")

# Find the highest correlation between any two variables
# Get the upper triangle of the correlation matrix
upper_tri <- upper.tri(full_cor_matrix)

# Create a data frame with all correlations
all_cors <- data.frame(
    Var1 = rownames(full_cor_matrix)[row(full_cor_matrix)[upper_tri]],
    Var2 = colnames(full_cor_matrix)[col(full_cor_matrix)[upper_tri]],
    Correlation = full_cor_matrix[upper_tri]
)

# Find the highest absolute correlation
max_cor_index <- which.max(abs(all_cors$Correlation))
highest_cor <- all_cors[max_cor_index, ]

# Print the results
print("\nHighest correlation between variables:")
print(paste("Variables:", highest_cor$Var1, "and", highest_cor$Var2))
print(paste("Correlation:", round(highest_cor$Correlation, 3)))

# Create a scatter plot of the variables with highest correlation
ggplot(as.data.frame(mtcars_matrix), 
       aes(x = .data[[highest_cor$Var1]], y = .data[[highest_cor$Var2]])) +
    geom_point() +
    geom_smooth(method = "lm", se = TRUE) +
    theme_minimal() +
    labs(title = paste("Scatter Plot of", highest_cor$Var1, "vs", highest_cor$Var2),
         x = highest_cor$Var1,
         y = highest_cor$Var2)

# Print detailed correlation analysis for cyl
print("\nDetailed correlation analysis for 'cyl':")
cyl_correlations <- full_cor_matrix["cyl", ]
cyl_cor_df <- data.frame(
    Variable = names(cyl_correlations),
    Correlation = cyl_correlations
)
cyl_cor_df <- cyl_cor_df[order(abs(cyl_cor_df$Correlation), decreasing = TRUE), ]
print(cyl_cor_df)

# Create a visualization of cyl's correlations
cyl_cor_melted <- melt(cyl_cor_df)
ggplot(cyl_cor_df, aes(x = reorder(Variable, abs(Correlation)), y = Correlation)) +
    geom_bar(stat = "identity", fill = ifelse(cyl_cor_df$Correlation > 0, "red", "blue")) +
    theme_minimal() +
    theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
    labs(title = "Correlations with Number of Cylinders (cyl)",
         x = "Variable",
         y = "Correlation Coefficient")

# Create scatter plots for cyl vs top correlated variables
top_cor_vars <- head(cyl_cor_df$Variable[cyl_cor_df$Variable != "cyl"], 3)
par(mfrow = c(1, 3))
for(var in top_cor_vars) {
    plot(mtcars_matrix[, "cyl"], mtcars_matrix[, var],
         xlab = "Number of Cylinders",
         ylab = var,
         main = paste("cyl vs", var))
    abline(lm(mtcars_matrix[, var] ~ mtcars_matrix[, "cyl"]), col = "red")
}
par(mfrow = c(1, 1))

# Print explanation
print("\nExplanation of cyl's high average correlation:")
print("The number of cylinders (cyl) has strong relationships with many other variables because:")
print("1. It's a fundamental engine characteristic that affects multiple aspects of car performance")
print("2. It's strongly related to engine size (disp), horsepower (hp), and weight (wt)")
print("3. It has an inverse relationship with fuel efficiency (mpg)")
print("4. It's related to transmission type (am) and number of gears (gear)")

# Create a correlation heatmap focusing on cyl's relationships
cyl_cor_matrix <- full_cor_matrix[c("cyl", top_cor_vars), c("cyl", top_cor_vars)]
melted_cyl_cor <- melt(cyl_cor_matrix)
ggplot(melted_cyl_cor, aes(x = Var1, y = Var2, fill = value)) +
    geom_tile() +
    scale_fill_gradient2(low = "blue", high = "red", mid = "white", 
                        midpoint = 0, limit = c(-1, 1), space = "Lab", 
                        name = "Correlation") +
    theme_minimal() +
    theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
    labs(title = "Correlation Heatmap: cyl and Top Correlated Variables",
         x = "",
         y = "")

# Create a multiple regression model
mlr_model <- lm(mpg ~ hp + wt + qsec, data = mtcars_df)

# Print model summary
print("\nMultiple Linear Regression Model Summary:")
print(summary(mlr_model))

# Stepwise Regression Analysis
print("\nStepwise Regression Analysis:")

# Create a full model with all potential predictors
full_model <- lm(mpg ~ ., data = mtcars_df)
print("\nFull Model Summary:")
print(summary(full_model))

# Perform stepwise regression using AIC
print("\nStepwise Regression using AIC:")
step_model <- stepAIC(full_model, direction = "both", trace = TRUE)
print("\nBest Model from Stepwise Selection:")
print(summary(step_model))

# Compare models using AIC
print("\nModel Comparison using AIC:")
print(paste("Full Model AIC:", round(AIC(full_model), 2)))
print(paste("Stepwise Model AIC:", round(AIC(step_model), 2)))

# Compare models using BIC
print("\nModel Comparison using BIC:")
print(paste("Full Model BIC:", round(BIC(full_model), 2)))
print(paste("Stepwise Model BIC:", round(BIC(step_model), 2)))

# Print the formula of the best model
print("\nBest Model Formula:")
print(formula(step_model))

# Create diagnostic plots for the stepwise model
print("\nGenerating diagnostic plots for stepwise model...")
create_diagnostic_plots(step_model, "Stepwise Model")

# Calculate and print VIF for the stepwise model
print("\nVIF values for stepwise model:")
print(vif(step_model))

# Compare R-squared values
print("\nComparison of R-squared values:")
r2_comparison <- data.frame(
    Full_Model = summary(full_model)$r.squared,
    Stepwise_Model = summary(step_model)$r.squared
)
print(r2_comparison)

# Create a plot of actual vs predicted values for stepwise model
predicted_step <- predict(step_model)
actual <- mtcars_df$mpg

plot_df_step <- data.frame(
    Actual = actual,
    Predicted = predicted_step
)

ggplot(plot_df_step, aes(x = Actual, y = Predicted)) +
    geom_point() +
    geom_abline(intercept = 0, slope = 1, color = "red", linetype = "dashed") +
    theme_minimal() +
    labs(title = "Actual vs Predicted MPG (Stepwise Model)",
         x = "Actual MPG",
         y = "Predicted MPG")

# Print model interpretation for stepwise model
print("\nStepwise Model Interpretation:")
print("1. Overall Model Fit:")
print(paste("The stepwise model explains", round(summary(step_model)$r.squared * 100, 1), 
            "% of the variance in MPG."))

print("\n2. Selected Variables and Their Effects:")
for(var in names(coef(step_model))[-1]) {  # Exclude intercept
    print(paste("\n", var, ":"))
    print(paste("   Coefficient:", round(coef(step_model)[var], 3)))
    print(paste("   p-value:", format.pval(summary(step_model)$coefficients[var, "Pr(>|t|)"], digits = 3)))
}

# Calculate standardized coefficients for stepwise model
std_coef_step <- coef(step_model) * c(1, sapply(mtcars_df[, names(coef(step_model))[-1]], sd)) / sd(mtcars_df$mpg)
print("\nStandardized Coefficients for Stepwise Model:")
print(round(std_coef_step, 3))

# Create a residual plot for stepwise model
residuals_step <- resid(step_model)
ggplot(data.frame(Fitted = fitted(step_model), Residuals = residuals_step),
       aes(x = Fitted, y = Residuals)) +
    geom_point() +
    geom_hline(yintercept = 0, color = "red", linetype = "dashed") +
    geom_smooth(method = "loess", se = TRUE) +
    theme_minimal() +
    labs(title = "Residual Plot (Stepwise Model)",
         x = "Fitted Values",
         y = "Residuals")

# Print residual statistics for stepwise model
print("\nResidual Statistics for Stepwise Model:")
print(paste("Mean of residuals:", round(mean(residuals_step), 3)))
print(paste("Standard deviation of residuals:", round(sd(residuals_step), 3)))
print(paste("Sum of squared residuals:", round(sum(residuals_step^2), 3)))

# Test for normality of residuals
print("\nShapiro-Wilk test for normality of residuals:")
print(shapiro.test(residuals_step))

# Test for homoscedasticity
print("\nBreusch-Pagan test for homoscedasticity:")
print(bptest(step_model))

# Calculate and print confidence intervals for coefficients
print("\n95% Confidence Intervals for Coefficients:")
print(confint(step_model))

# Create a coefficient plot
coef_df <- data.frame(
    Variable = names(coef(step_model)),
    Coefficient = coef(step_model),
    Lower = confint(step_model)[, 1],
    Upper = confint(step_model)[, 2]
)

ggplot(coef_df, aes(x = reorder(Variable, Coefficient), y = Coefficient)) +
    geom_point() +
    geom_errorbar(aes(ymin = Lower, ymax = Upper), width = 0.2) +
    geom_hline(yintercept = 0, color = "red", linetype = "dashed") +
    theme_minimal() +
    theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
    labs(title = "Coefficient Plot with 95% Confidence Intervals",
         x = "Variable",
         y = "Coefficient")

# Calculate standardized coefficients
std_coef <- coef(mlr_model) * c(1, sapply(mtcars_df[, c("hp", "wt", "qsec")], sd)) / sd(mtcars_df$mpg)
print("\nStandardized Coefficients:")
print(round(std_coef, 3))

# Create a plot of actual vs predicted values
predicted <- predict(mlr_model)
actual <- mtcars_df$mpg

plot_df <- data.frame(
    Actual = actual,
    Predicted = predicted
)

ggplot(plot_df, aes(x = Actual, y = Predicted)) +
    geom_point() +
    geom_abline(intercept = 0, slope = 1, color = "red", linetype = "dashed") +
    theme_minimal() +
    labs(title = "Actual vs Predicted MPG",
         x = "Actual MPG",
         y = "Predicted MPG")

# Calculate and print residual statistics
residuals <- resid(mlr_model)
print("\nResidual Statistics:")
print(paste("Mean of residuals:", round(mean(residuals), 3)))
print(paste("Standard deviation of residuals:", round(sd(residuals), 3)))
print(paste("Sum of squared residuals:", round(sum(residuals^2), 3)))

# Create a residual plot
ggplot(data.frame(Fitted = fitted(mlr_model), Residuals = residuals),
       aes(x = Fitted, y = Residuals)) +
    geom_point() +
    geom_hline(yintercept = 0, color = "red", linetype = "dashed") +
    geom_smooth(method = "loess", se = TRUE) +
    theme_minimal() +
    labs(title = "Residual Plot",
         x = "Fitted Values",
         y = "Residuals")

# Print model interpretation
print("\nModel Interpretation:")
print("1. Overall Model Fit:")
print(paste("The model explains", round(summary(mlr_model)$r.squared * 100, 1), 
            "% of the variance in MPG."))

print("\n2. Individual Variable Effects:")
print("Horsepower (hp):")
print(paste("   Coefficient:", round(coef(mlr_model)["hp"], 3)))
print(paste("   Standardized coefficient:", round(std_coef["hp"], 3)))
print(paste("   p-value:", format.pval(summary(mlr_model)$coefficients["hp", "Pr(>|t|)"], digits = 3)))

print("\nWeight (wt):")
print(paste("   Coefficient:", round(coef(mlr_model)["wt"], 3)))
print(paste("   Standardized coefficient:", round(std_coef["wt"], 3)))
print(paste("   p-value:", format.pval(summary(mlr_model)$coefficients["wt", "Pr(>|t|)"], digits = 3)))

print("\nQuarter Mile Time (qsec):")
print(paste("   Coefficient:", round(coef(mlr_model)["qsec"], 3)))
print(paste("   Standardized coefficient:", round(std_coef["qsec"], 3)))
print(paste("   p-value:", format.pval(summary(mlr_model)$coefficients["qsec", "Pr(>|t|)"], digits = 3))) 