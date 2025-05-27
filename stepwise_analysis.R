# Load required packages
required_packages <- c("ggplot2", "MASS", "car", "dplyr", "tidyr")
for(pkg in required_packages) {
    if(!require(pkg, character.only = TRUE)) {
        install.packages(pkg)
        library(pkg, character.only = TRUE)
    }
}

# Load the mtcars dataset
data(mtcars)

# Convert am to factor
mtcars$am <- factor(mtcars$am, levels = c(0, 1), labels = c("Automatic", "Manual"))

# Create a full model with all potential predictors
full_model <- lm(mpg ~ ., data = mtcars)

# Print initial model summary
cat("\nInitial Full Model Summary:\n")
print(summary(full_model))

# Perform stepwise regression using AIC
cat("\nPerforming Stepwise Regression...\n")
step_model <- stepAIC(full_model, direction = "both", trace = TRUE)

# Print final model summary
cat("\nFinal Stepwise Model Summary:\n")
print(summary(step_model))

# Compare models using AIC and BIC
model_comparison <- data.frame(
    Model = c("Full Model", "Stepwise Model"),
    AIC = c(AIC(full_model), AIC(step_model)),
    BIC = c(BIC(full_model), BIC(step_model)),
    R_squared = c(summary(full_model)$r.squared, summary(step_model)$r.squared),
    Adj_R_squared = c(summary(full_model)$adj.r.squared, summary(step_model)$adj.r.squared)
)

# Print model comparison
cat("\nModel Comparison:\n")
print(model_comparison)

# Create a visualization of model comparison
model_comparison_long <- model_comparison %>%
    pivot_longer(cols = c(AIC, BIC, R_squared, Adj_R_squared),
                names_to = "Metric",
                values_to = "Value")

# Plot model comparison
ggplot(model_comparison_long, aes(x = Model, y = Value, fill = Model)) +
    geom_bar(stat = "identity", position = "dodge") +
    facet_wrap(~ Metric, scales = "free_y") +
    theme_minimal() +
    theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
    labs(title = "Model Comparison Metrics",
         x = "",
         y = "Value")

# Create coefficient comparison plot
coef_comparison <- data.frame(
    Variable = c(names(coef(full_model)), names(coef(step_model))),
    Coefficient = c(coef(full_model), coef(step_model)),
    Model = rep(c("Full Model", "Stepwise Model"), 
               times = c(length(coef(full_model)), length(coef(step_model))))
)

# Plot coefficient comparison
ggplot(coef_comparison, aes(x = Variable, y = Coefficient, fill = Model)) +
    geom_bar(stat = "identity", position = "dodge") +
    theme_minimal() +
    theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
    labs(title = "Coefficient Comparison",
         x = "Variables",
         y = "Coefficient Value")

# Create residual plots for both models
par(mfrow = c(2, 2))
plot(full_model, main = "Full Model Residuals")
plot(step_model, main = "Stepwise Model Residuals")
par(mfrow = c(1, 1))

# Calculate and print VIF for both models
cat("\nVIF values for Full Model:\n")
print(vif(full_model))

cat("\nVIF values for Stepwise Model:\n")
print(vif(step_model))

# Create actual vs predicted plots for both models
# Full model predictions
full_pred <- predict(full_model)
full_actual <- mtcars$mpg

# Stepwise model predictions
step_pred <- predict(step_model)
step_actual <- mtcars$mpg

# Create data frames for plotting
full_plot_df <- data.frame(
    Actual = full_actual,
    Predicted = full_pred,
    Model = "Full Model"
)

step_plot_df <- data.frame(
    Actual = step_actual,
    Predicted = step_pred,
    Model = "Stepwise Model"
)

# Combine data frames
plot_df <- rbind(full_plot_df, step_plot_df)

# Create actual vs predicted plot
ggplot(plot_df, aes(x = Actual, y = Predicted, color = Model)) +
    geom_point() +
    geom_abline(intercept = 0, slope = 1, color = "black", linetype = "dashed") +
    facet_wrap(~ Model) +
    theme_minimal() +
    labs(title = "Actual vs Predicted MPG",
         x = "Actual MPG",
         y = "Predicted MPG")

# Print model interpretation
cat("\nModel Interpretation:\n")
cat("1. Variables Selected by Stepwise Regression:\n")
print(names(coef(step_model))[-1])  # Exclude intercept

cat("\n2. Variables Removed by Stepwise Regression:\n")
removed_vars <- setdiff(names(coef(full_model)), names(coef(step_model)))
print(removed_vars)

cat("\n3. Improvement in Model Fit:\n")
cat(sprintf("R-squared improvement: %.3f\n", 
            summary(step_model)$r.squared - summary(full_model)$r.squared))
cat(sprintf("AIC improvement: %.3f\n", 
            AIC(full_model) - AIC(step_model)))
cat(sprintf("BIC improvement: %.3f\n", 
            BIC(full_model) - BIC(step_model)))

# Print final model formula
cat("\nFinal Model Formula:\n")
print(formula(step_model)) 