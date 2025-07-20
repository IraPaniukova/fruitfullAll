using fruitfullServer.Models;
using fruitfullServer.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using fruitfullServer.Hubs;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddDbContext<FruitfullDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// This sets authorization policy:
// Endpoints with [Authorize(Policy = "LoginPolicy")] require authentication.
//TODO: comment/uncomment the next piece
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("LoginPolicy", policy => policy.RequireAuthenticatedUser());
    
builder.Services.AddControllers();
// builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your token"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<UserService>(); // Registers Services for dependency injections
builder.Services.AddScoped<PostService>();  
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<CommentService>();
builder.Services.AddScoped<TagService>();
builder.Services.AddScoped<ReportService>();

builder.Services.AddScoped<IGoogleValidator, GoogleValidator>(); //added for testing pruposes

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",policy =>
    {
         policy
            .WithOrigins("http://localhost:5173", "https://fruitfull.info") // frontend origin
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();  // allow cookies/auth headers
    });
});

builder.Services.AddOpenApi();

string? jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
if (string.IsNullOrEmpty(jwtKey))  throw new Exception("JWT secret key is not set!");

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };

        // This is for SignalR:
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/comments"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

app.UseRouting(); // Enables routing to match HTTP requests to controllers

app.UseCors("AllowSpecificOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<CommentHub>("/hubs/comments");

app.MapControllers(); // Maps attribute-routed controllers to endpoints

app.Run();

