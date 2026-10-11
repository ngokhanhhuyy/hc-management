using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.OpenApi;
using System.Reflection;
using System.Text.Json.Serialization.Metadata;

namespace HCManagement.Api.Configurations;

public static class OpenApiConfigurations
{
    #region Extensions
    extension(IServiceCollection services)
    {
        public IServiceCollection AddAndConfigureOpenApi()
        {
            NullabilityInfoContext nullabilityContext = new();
            return services.AddOpenApi(options =>
            {
                options.AddOperationTransformer((operation, context, cancellationToken) =>
                {
                    ApiDescription apiDescription = context.Description;
                    string? controllerName = apiDescription.ActionDescriptor.RouteValues["controller"];
                    string? actionName = apiDescription.ActionDescriptor.RouteValues["action"];

                    if (actionName is "List" or "Detail")
                    {
                        actionName = $"Get{actionName}";
                    }

                    operation.OperationId = $"{controllerName}_{actionName}";

                    return Task.CompletedTask;
                });

                options.AddSchemaTransformer((schema, context, cancellationToken) =>
                {
                    JsonTypeInfo typeInfo = context.JsonTypeInfo;

                    if (!typeInfo.Type.Name.EndsWith("ResponseDto"))
                    {
                        return Task.CompletedTask;
                    }

                    if (typeInfo.Type is not { IsClass: true })
                    {
                        return Task.CompletedTask;
                    }

                    foreach (JsonPropertyInfo property in typeInfo.Properties)
                    {
                        if (property.AttributeProvider is not PropertyInfo propertyInfo)
                        {
                            continue;
                        }

                        // Every response DTO property must be present.
                        schema.Required ??= new HashSet<string>();
                        schema.Required.Add(property.Name);

                        NullabilityInfo nullability = nullabilityContext.Create(propertyInfo);

                        if (nullability.ReadState == NullabilityState.Nullable)
                        {
                            MakeNullable(schema, property.Name);
                        }
                        else
                        {
                            MakeNonNullable(schema, property.Name);
                        }
                    }

                    return Task.CompletedTask;
                });
            });
        }
    }
    #endregion

    #region PrivateStaticMethods
    private static void MakeNullable(OpenApiSchema schema, string propertyName)
    {
        if (schema.Properties?.TryGetValue(propertyName, out IOpenApiSchema? propertySchema) != true)
        {
            return;
        }

        if (propertySchema is null)
        {
            return;
        }

        schema.Properties[propertyName] = new OpenApiSchema
        {
            AnyOf = new List<IOpenApiSchema>
            {
                propertySchema,
                new OpenApiSchema
                {
                    Type = JsonSchemaType.Null
                }
            }
        };
    }

    private static void MakeNonNullable(OpenApiSchema schema, string propertyName)
    {
        if (schema.Properties?.TryGetValue(propertyName, out IOpenApiSchema? propertySchema) != true)
        {
            return;
        }

        if (propertySchema is not OpenApiSchema openApiSchema)
        {
            return;
        }

        if (openApiSchema.Type is null)
        {
            return;
        }

        JsonSchemaType type = openApiSchema.Type.Value;
        if (!type.HasFlag(JsonSchemaType.Null))
        {
            return;
        }

        type &= ~JsonSchemaType.Null;

        if (type == 0)
        {
            return;
        }

        openApiSchema.Type = type;
    }
    #endregion
}
